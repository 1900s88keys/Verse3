import { PerspectiveCamera } from 'three';

import { cameraSetting } from '../setting/Setting';

import type { Sizes } from '../sizes/Sizes';

export class Camera {
  private _instance: PerspectiveCamera;

  private sizes: Sizes;

  get instance() {
    return this._instance;
  }

  constructor({ sizes }: { sizes: Sizes }) {
    this.sizes = sizes;
    this._instance = this.createPerspectiveCamera();
    this.bindEvents();
  }

  private createPerspectiveCamera() {
    const [fov, aspect, near, far] = [
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    ];

    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.lookAt(
      cameraSetting.defaultLookAt.x,
      cameraSetting.defaultLookAt.y,
      cameraSetting.defaultLookAt.z,
    );
    camera.position.set(
      cameraSetting.defaultPosition.x,
      cameraSetting.defaultPosition.y,
      cameraSetting.defaultPosition.z,
    );
    return camera;
  }

  private bindEvents() {
    this.sizes.on('resize', this.handleResize);
  }

  private unbindEvents() {
    this.sizes.off('resize', this.handleResize);
  }

  private handleResize = () => {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  };

  destroy() {
    this.unbindEvents();
  }
}
