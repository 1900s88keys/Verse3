import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type ColorRepresentation,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';

import flyLineFragmentShader from '@/shared/shaders/glsl/fly-line/fragment.glsl?raw';
import flyLineVertexShader from '@/shared/shaders/glsl/fly-line/vertex.glsl?raw';
import particleFragmentShader from '@/shared/shaders/glsl/particle/fragment.glsl?raw';
import particleVertexShader from '@/shared/shaders/glsl/particle/vertex.glsl?raw';
import { latLngToVector3 } from '@/shared/utils/geo/Geo';

import { GreatCircleCurve3 } from '../curve/GreatCircleCurve3';

import type { Arc } from '../data/arcs';
import type { Setting } from '../setting/Setting';
import type { Entity } from '../type/Type';

interface Point {
  lat: number;
  lng: number;
  color: string;
  size: number;
  name: string;
  region: string;
}

export class FlyLine extends Object3D {
  private setting: Setting;

  private currentTime: number;

  private curveList: GreatCircleCurve3[] = [];

  // 飞线
  private flyLineGroupEntity: Entity<Line, BufferGeometry, ShaderMaterial>;

  // 粒子
  private singleParticlePosCount: number = 0;

  private particleEntity: Entity<Mesh, BufferGeometry, ShaderMaterial>;

  // 点
  private pointEntity: Entity<Mesh, BufferGeometry, MeshBasicMaterial>;

  constructor({ setting }: { setting: Setting }) {
    super();
    this.currentTime = 0;

    this.setting = setting;
    this.name = 'flyLine';

    this.flyLineGroupEntity = this.createFlyLines();
    this.add(this.flyLineGroupEntity.mesh);

    this.particleEntity = this.createParticles();
    this.add(this.particleEntity.mesh);

    this.pointEntity = this.createPoints();
    this.add(this.pointEntity.mesh);
  }

  // 创建曲线
  private createCurve(line: Arc) {
    const startPos = latLngToVector3(
      line.startLat,
      line.startLng,
      this.setting.earthAttr.radius,
    );
    const endPos = latLngToVector3(
      line.endLat,
      line.endLng,
      this.setting.earthAttr.radius,
    );

    return new GreatCircleCurve3(
      startPos,
      endPos,
      this.setting.earthAttr.radius,
      1.3,
    );
  }

  // 创建飞线
  private createFlyLines() {
    const flyLineGeometries = this.setting.flyLineAttr.flyLineData.map(
      (line) => {
        const curve = this.createCurve(line);
        this.curveList.push(curve);
        return this.createFlyLineGeometry(curve, line.color);
      },
    );

    const geometries = BufferGeometryUtils.mergeGeometries(
      flyLineGeometries,
      false,
    );
    flyLineGeometries.forEach((geometry) => {
      geometry.dispose();
    });
    const material = new ShaderMaterial({
      blending: AdditiveBlending,
      side: BackSide,
      transparent: true,
      uniforms: {
        flowLength: { value: this.setting.flyLineAttr.flyingLineLength || 0.2 },
        growthDuration: {
          value: this.setting.flyLineAttr.growthDuration || 0.5,
        },
        currentTime: { value: 0.0 },
      },
      vertexShader: flyLineVertexShader,
      fragmentShader: flyLineFragmentShader,
    });
    const flyLineGroupMesh = new Line(geometries, material);
    flyLineGroupMesh.renderOrder = 4;
    return {
      mesh: flyLineGroupMesh,
      geometry: geometries,
      material,
    };
  }

  private createFlyLineGeometry(curve: GreatCircleCurve3, color: string) {
    const points = curve.getPoints(100);

    // 创建静态弧线（背景轨迹）
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    lineGeometry.setAttribute(
      'uv',
      new BufferAttribute(
        new Float32Array(
          points
            .map((_, index) => [
              index / (points.length - 1),
              index / (points.length - 1),
            ])
            .flat(),
        ),
        2,
      ),
    );

    lineGeometry.setAttribute(
      'uLineColor',
      new BufferAttribute(
        new Float32Array(
          points
            .map(() => [...new Vector3().setFromColor(new Color(color))])
            .flat(),
        ),
        3,
      ),
    );
    return lineGeometry;
  }

  // 创建移动的粒子
  private createParticles() {
    const particleGeometries = this.setting.flyLineAttr.flyLineData.map(
      (line) => {
        return this.createParticleGeometry(line.color);
      },
    );

    const geometries = BufferGeometryUtils.mergeGeometries(
      particleGeometries,
      false,
    );

    particleGeometries.forEach((geometry) => {
      geometry.dispose();
    });

    const material = new ShaderMaterial({
      blending: AdditiveBlending,
      side: BackSide,
      transparent: true,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
    });
    const particlesMesh = new Mesh(geometries, material);
    particlesMesh.renderOrder = 3;

    return {
      mesh: particlesMesh,
      geometry: geometries,
      material,
    };
  }

  private createParticleGeometry(color: ColorRepresentation | undefined) {
    const geometry = new SphereGeometry(
      this.setting.flyLineAttr.particleSize,
      8,
      8,
    );
    this.singleParticlePosCount = geometry.attributes.position?.count ?? 0;
    // 为每个顶点添加颜色属性
    const colorArray = new Float32Array(this.singleParticlePosCount * 3);
    const colorVector = new Vector3().setFromColor(new Color(color));

    // 为所有顶点设置相同的颜色
    for (let i = 0; i < this.singleParticlePosCount; i++) {
      colorArray[i * 3] = colorVector.x;
      colorArray[i * 3 + 1] = colorVector.y;
      colorArray[i * 3 + 2] = colorVector.z;
    }

    geometry.setAttribute('color', new BufferAttribute(colorArray, 3));
    return geometry;
  }

  private updateParticles() {
    // 获取流动线条的时间参数
    const flowTime = this.currentTime;
    const growthDuration = this.setting.flyLineAttr.growthDuration || 1.0;
    const flowLength = this.setting.flyLineAttr.flyingLineLength || 0.4;

    // 计算线段生长的进度
    const growthProgress = Math.min(flowTime / growthDuration, 1.0);
    const showParticles = growthProgress >= 1.0;

    // 设置粒子网格可见性
    this.particleEntity.mesh.visible = showParticles;

    if (showParticles) {
      // 为每个流动线条更新粒子位置
      const transformPositions: number[] = [];

      const flowAnimationTime = Math.max(0.0, flowTime - growthDuration);
      const flowOffset =
        ((flowAnimationTime % (1.0 + flowLength)) + (1.0 + flowLength)) %
        (1.0 + flowLength);

      // 流动线条的头部位置
      const normalizedFlowOffset = Math.min(Math.max(flowOffset, 0.0), 1.0);
      this.curveList.forEach((curve) => {
        // 计算粒子在线段上的位置（流动线条头部）
        const particlePosition = curve.getPoint(normalizedFlowOffset);
        // 存储粒子位置
        transformPositions.push(
          ...new Array(this.singleParticlePosCount).fill([
            particlePosition.x,
            particlePosition.y,
            particlePosition.z,
          ]),
        );
      });

      // 更新粒子几何体的位置属性
      this.particleEntity.geometry.setAttribute(
        'uPosition',
        new BufferAttribute(new Float32Array(transformPositions.flat()), 3),
      );
      // 粒子效果
      const pulseScale = 1 + 0.5 * Math.sin(this.currentTime * 30.0);
      this.particleEntity.mesh.scale.setScalar(pulseScale);

      // 透明度计算
      const fadeProgress = Math.sin(normalizedFlowOffset * Math.PI);
      this.particleEntity.material.opacity = 0.8 * fadeProgress;
    }
  }

  // 创建地区点
  private createPoints() {
    // 去重处理
    const uniquePoints = this.removeDuplicatePoints(
      this.setting.pointCloudAttr.pointsData,
    );

    const material = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      vertexColors: true,
    });
    const geometries = uniquePoints.map((point) => {
      return this.createPointGeometry(point);
    });

    const mergeGeometries = BufferGeometryUtils.mergeGeometries(
      geometries,
      false,
    );

    geometries.forEach((geometry) => {
      geometry.dispose();
    });

    const pointMesh = new Mesh(mergeGeometries, material);
    return {
      mesh: pointMesh,
      geometry: mergeGeometries,
      material,
    };
  }

  private createPointGeometry(point: Point) {
    const geometry = new SphereGeometry(
      this.setting.pointCloudAttr.pointSize,
      8,
      8,
    );
    const position = latLngToVector3(
      point.lat,
      point.lng,
      this.setting.earthAttr.radius + 0.5,
    );
    const colorArray = new Float32Array(
      (geometry.attributes.position?.count ?? 0) * 3,
    );
    const colorVector = new Vector3().setFromColor(
      new Color(point.color || '#fff'),
    );
    for (let i = 0; i < colorArray.length; i++) {
      colorArray[i * 3] = colorVector.x;
      colorArray[i * 3 + 1] = colorVector.y;
      colorArray[i * 3 + 2] = colorVector.z;
    }
    geometry.setAttribute('color', new BufferAttribute(colorArray, 3));
    geometry.translate(position.x, position.y, position.z);
    return geometry;
  }

  private removeDuplicatePoints(points: Point[]) {
    const seen = new Set();
    return points.filter((point) => {
      const key = `${point.lat},${point.lng}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  update() {
    this.currentTime += this.setting.flyLineAttr.flowSpeed / 1000;
    if (this.flyLineGroupEntity.material.uniforms.currentTime) {
      this.flyLineGroupEntity.material.uniforms.currentTime.value =
        this.currentTime;
    }

    // 更新所有粒子
    this.updateParticles();
  }

  destroy() {
    this.remove(this.flyLineGroupEntity.mesh);
    this.flyLineGroupEntity.geometry.dispose();
    this.flyLineGroupEntity.material.dispose();

    this.remove(this.particleEntity.mesh);
    this.particleEntity.geometry.dispose();
    this.particleEntity.material.dispose();

    this.remove(this.pointEntity.mesh);
    this.pointEntity.geometry.dispose();
    this.pointEntity.material.dispose();

    this.curveList = [];
    this.children = [];
  }
}
