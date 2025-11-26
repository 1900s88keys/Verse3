import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';

import waveFragmentShader from '@/shared/shaders/glsl/wave/fragment.glsl?raw';
import waveVertexShader from '@/shared/shaders/glsl/wave/vertex.glsl?raw';
import { latLngToVector3 } from '@/shared/utils/geo/Geo';

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

export class Marker extends Object3D {
  private currentTime: number;

  private setting: Setting;
  // 点
  private pointEntity: Entity<Mesh, BufferGeometry, MeshBasicMaterial>;

  // 波纹点
  private wavePointEntity: Entity<Mesh, BufferGeometry, ShaderMaterial>;

  constructor({ setting }: { setting: Setting }) {
    super();
    this.name = 'Marker';
    this.currentTime = 0;
    this.setting = setting;
    this.pointEntity = this.createPoints();
    this.add(this.pointEntity.mesh);
    this.renderOrder = 1;

    this.wavePointEntity = this.createWavePoints();
    this.add(this.wavePointEntity.mesh);
  }

  // 创建地区点
  private createPoints() {
    // 去重处理
    const uniquePoints = this.removeDuplicatePoints(
      this.setting.pointAttr.pointsData,
    );

    const material = new MeshBasicMaterial({
      depthWrite: true,
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
    pointMesh.renderOrder = 5;
    return {
      mesh: pointMesh,
      geometry: mergeGeometries,
      material,
    };
  }

  private createPointGeometry(point: Point) {
    const geometry = new SphereGeometry(
      this.setting.pointAttr.pointSize,
      16,
      16,
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

  // 去重
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

  // 创建地区底圆
  private createWavePoints() {
    const wavePointGeometries = this.setting.pointAttr.pointsData.map((point) =>
      this.createWavePointGeometry(point),
    );

    const material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0.0 },
        waveCount: { value: this.setting.waveAttr.waveCount },
        waveThickness: { value: this.setting.waveAttr.waveThickness },
      },
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,
    });

    const geometries = BufferGeometryUtils.mergeGeometries(
      wavePointGeometries,
      false,
    );

    wavePointGeometries.forEach((geometry) => {
      geometry.dispose();
    });
    const mesh = new Mesh(geometries, material);
    mesh.renderOrder = 1;
    return {
      mesh,
      geometry: geometries,
      material,
    };
  }

  private createWavePointGeometry(point: Point) {
    const position = latLngToVector3(
      point.lat,
      point.lng,
      this.setting.earthAttr.radius + 0.001,
    );
    const geometry = new CircleGeometry(
      this.setting.ringAttr.maxRings * this.setting.ringAttr.wavePointScale,
    );
    const viewMatrix = new Matrix4().lookAt(
      position, // 相机位置
      new Vector3(0, 0, 0), // 观察目标
      new Vector3(0, 1, 0), // 相机上方向
    );
    geometry.applyMatrix4(viewMatrix);
    geometry.translate(position.x, position.y, position.z);

    const color = point.color || this.setting.ringAttr.ringColor;
    const count = geometry.attributes.position?.count ?? 0;
    // 为每个顶点添加颜色属性
    const colorArray = new Float32Array(count * 3);
    const colorVector = new Vector3().setFromColor(new Color(color));

    // 为所有顶点设置相同的颜色
    for (let i = 0; i < count; i++) {
      colorArray[i * 3] = colorVector.x;
      colorArray[i * 3 + 1] = colorVector.y;
      colorArray[i * 3 + 2] = colorVector.z;
    }

    geometry.setAttribute('color', new BufferAttribute(colorArray, 3));
    return geometry;
  }

  update() {
    this.currentTime += this.setting.waveAttr.waveDuration / 1000;
    if (this.wavePointEntity.material.uniforms.uTime) {
      this.wavePointEntity.material.uniforms.uTime.value = this.currentTime;
    }
  }

  destroy() {
    this.remove(this.pointEntity.mesh);
    this.pointEntity.geometry.dispose();
    this.pointEntity.material.dispose();

    this.remove(this.wavePointEntity.mesh);
    this.wavePointEntity.geometry.dispose();
    this.wavePointEntity.material.dispose();

    this.children = [];
  }
}
