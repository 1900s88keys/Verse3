import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  CubicBezierCurve3,
  Line,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  QuadraticBezierCurve3,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type ColorRepresentation,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js';

import flyLineFragmentShader from '@/shared/shaders/fly-line/fragment.glsl?raw';
import flyLineVertexShader from '@/shared/shaders/fly-line/vertex.glsl?raw';
import { latLngToVector3 } from '@/shared/utils/geo/Geo';

import type { Arc } from '../data/arcs';
import type { Setting } from '../setting/Setting';

export class FlyLine extends Object3D {
  private setting: Setting;

  private time: number;

  private flyLineMaterial: ShaderMaterial;

  private flyLineGeometries: BufferGeometry[] = [];

  constructor({ setting }: { setting: Setting }) {
    super();
    this.time = 0;

    this.setting = setting;
    this.name = 'flyLine';

    this.flyLineMaterial = new ShaderMaterial({
      blending: AdditiveBlending,
      side: BackSide,
      transparent: true,
      uniforms: {
        flowLength: { value: this.setting.flyLineAttr.flyingLineLength },
        time: { value: 0.0 },
      },
      vertexShader: flyLineVertexShader,
      fragmentShader: flyLineFragmentShader,
    });

    this.createFlyLines();
  }

  createFlyLines() {
    this.setting.flyLineAttr.flyLineData.forEach((line) => {
      this.createFlyLine(line);
    });
    const geometries = BufferGeometryUtils.mergeGeometries(
      this.flyLineGeometries,
      false,
    );
    const staticLine = new Line(geometries, this.flyLineMaterial);
    staticLine.renderOrder = 4;
    this.add(staticLine);
  }

  createFlyLine(line: Arc) {
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

    // 计算两点间的角度和弧线
    const angle = startPos.angleTo(endPos);
    const arcHeight = this.setting.earthAttr.radius * (line.arcAlt || 0.1);
    const angleThreshold = Math.PI / 3; // 60度

    const curve = this.createCurve(
      startPos,
      endPos,
      angle,
      arcHeight,
      angleThreshold,
    );
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
            .map(() => [...new Vector3().setFromColor(new Color(line.color))])
            .flat(),
        ),
        3,
      ),
    );

    lineGeometry.setAttribute(
      'uFlowColor',
      new BufferAttribute(
        new Float32Array(
          points
            .map(() => [...new Vector3().setFromColor(new Color(line.color))])
            .flat(),
        ),
        3,
      ),
    );

    this.flyLineGeometries.push(lineGeometry);
  }

  createParticle(color: ColorRepresentation) {
    const geometry = new SphereGeometry(
      this.setting.flyLineAttr.particleSize,
      8,
      8,
    );

    const material = new MeshBasicMaterial({
      color: new Color(color),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    return new Mesh(geometry, material);
  }

  createCurve(
    startPos: Vector3,
    endPos: Vector3,
    angle: number,
    arcHeight: number,
    angleThreshold: number,
  ) {
    if (angle > angleThreshold) {
      // 三次贝塞尔曲线
      const midPoint = new Vector3()
        .addVectors(startPos, endPos)
        .multiplyScalar(0.5);
      midPoint
        .normalize()
        .multiplyScalar(this.setting.earthAttr.radius + arcHeight);

      const controlPoint1 = new Vector3().lerpVectors(startPos, midPoint, 0.5);
      controlPoint1
        .normalize()
        .multiplyScalar(this.setting.earthAttr.radius + arcHeight);

      const controlPoint2 = new Vector3().lerpVectors(midPoint, endPos, 0.5);
      controlPoint2
        .normalize()
        .multiplyScalar(this.setting.earthAttr.radius + arcHeight);

      return new CubicBezierCurve3(
        startPos,
        controlPoint1,
        controlPoint2,
        endPos,
      );
    } else {
      // 二次贝塞尔曲线
      const midPoint = new Vector3()
        .addVectors(startPos, endPos)
        .multiplyScalar(0.5);
      midPoint
        .normalize()
        .multiplyScalar(this.setting.earthAttr.radius + arcHeight);

      return new QuadraticBezierCurve3(startPos, midPoint, endPos);
    }
  }

  update(delta: number) {
    this.time += delta;
    if (this.flyLineMaterial.uniforms.time) {
      this.flyLineMaterial.uniforms.time.value +=
        this.setting.flyLineAttr.flowSpeed / 100;
    }
  }

  destroy() {
    this.flyLineMaterial.dispose();
    this.flyLineGeometries.forEach((geometry) => {
      geometry.dispose();
    });
    this.flyLineGeometries = [];
  }
}
