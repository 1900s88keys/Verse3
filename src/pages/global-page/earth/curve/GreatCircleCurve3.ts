import { Curve, Vector3, Quaternion } from 'three';

export class GreatCircleCurve3 extends Curve<Vector3> {
  private planeNormal: Vector3; // 大圆平面法向量

  private angle: number; // 大圆的角度范围
  /**
   * 创建大圆路径
   * @param {Vector3} fromPoint - 起点（在球面上）
   * @param {Vector3} toPoint - 终点（在球面上）
   * @param {number} radius - 基础球的半径
   * @param {number} peakHeight - 最高点相对于球面的高度（乘数）
   */
  constructor(
    private fromPoint: Vector3 = new Vector3(1, 0, 0),
    private toPoint: Vector3 = new Vector3(0, 0, 1),
    private radius: number = 1.0,
    private peakHeight: number = 1.5,
  ) {
    super();

    this.fromPoint = fromPoint.clone().normalize();
    this.toPoint = toPoint.clone().normalize();
    this.radius = radius;
    this.peakHeight = peakHeight;

    // 预计算大圆平面法向量
    this.planeNormal = new Vector3()
      .crossVectors(this.fromPoint, this.toPoint)
      .normalize();

    // 计算大圆的角度范围
    this.angle = this.fromPoint.angleTo(this.toPoint);
  }

  /**
   * 根据参数t获取曲线上的点
   * @param {number} t 参数t
   * @param {Vector3} optionalTarget 当前目标向量
   */
  getPoint(t: number, optionalTarget: Vector3 = new Vector3()): Vector3 {
    const point = optionalTarget;

    // 计算球面上的大圆点（基础位置）
    const angle = t * this.angle;
    const rotationAxis = this.planeNormal;
    const quaternion = new Quaternion();
    quaternion.setFromAxisAngle(rotationAxis, angle);

    const basePoint = this.fromPoint.clone().applyQuaternion(quaternion);

    // 计算平滑的高度因子
    const heightFactor = this.calculateSmoothHeightFactor(t);

    // 隆起高度（沿法线方向）
    point.copy(basePoint).multiplyScalar(heightFactor * this.radius);

    return point;
  }

  /**
   * 根据参数t获取曲线上的点
   * @param {number} t 参数t
   * @param {number} radiusK 弧度系数 默认0.2
   */
  calculateSmoothHeightFactor(t: number, radiusK: number = 0.2) {
    /**
     * 使用三次贝塞尔曲线来控制高度变化
     * 控制点确保起点终点高度为1，导数为0
     */

    const t2 = t * t;
    const t3 = t2 * t;
    const s = 1 - t;
    const s2 = s * s;
    const s3 = s2 * s;

    /**
     * 控制点：P0=1, P1=1, P2=peakHeight, P3=1
     * 曲线系数：radK
     */
    const p0 = 1.0;
    const p1 = 1.0 + (this.peakHeight - 1.0) * radiusK;
    const p2 = this.peakHeight;
    const p3 = 1.0;

    return s3 * p0 + 3 * s2 * t * p1 + 3 * s * t2 * p2 + t3 * p3;
  }
}
