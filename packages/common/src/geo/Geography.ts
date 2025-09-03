import { Vector3 } from "three";

export class Geography {
  private _radius: number;

  private _longitude: number;

  private _latitude: number;

  private _position: Vector3;
  /**
   * @param {number} radius 地理半径
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * */
  constructor(radius: number = 1, longitude: number = 0, latitude: number = 0) {
    this._radius = radius;
    this._latitude = latitude;
    this._longitude = longitude;
    this._position = new Vector3();
  }

  get radius() {
    return this._radius;
  }

  get longitude() {
    return this._longitude;
  }

  get latitude() {
    return this._latitude;
  }

  get position() {
    return this._position.clone();
  }

  /**
   * @param {number} radius 地理半径
   * @returns {this}
   * */
  updateRadius(radius: number = this.radius): this {
    this._radius = radius;
    this.updatePos();
    return this;
  }

  /**
   * @param {number} radius 地理半径
   * @param {number} longitude 经度
   * @param {number} latitude 纬度
   * @returns {this}
   * */
  updatePos(
    radius: number = this.radius,
    longitude: number = this.longitude,
    latitude: number = this.latitude
  ): this {
    this._radius = radius;
    this._longitude = longitude;
    this._latitude = latitude;
    const { radius: r, longitude: lng, latitude: lat } = this;

    const theta = lng * (Math.PI / 180);
    const phi = lat * (Math.PI / 180);
    const len = r * Math.cos(phi);

    const x = Math.cos(theta) * len;
    const y = Math.sin(phi);
    const z = -Math.sin(theta) * len;
    this._position.set(x, y, z);
    return this;
  }
}
