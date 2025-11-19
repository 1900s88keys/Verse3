import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Pane, type FolderApi } from 'tweakpane';

export class CameraControl {
  private _instance: OrbitControls;

  private pane: FolderApi;

  get instance() {
    return this._instance;
  }

  constructor({
    pane,
    canvas,
    camera,
  }: {
    pane: Pane;
    canvas: HTMLCanvasElement;
    camera: PerspectiveCamera;
  }) {
    this.pane = pane.addFolder({
      title: '相机控制',
    });
    this._instance = new OrbitControls(camera, canvas);
    this._instance.enableDamping = true;
    this._instance.enablePan = false;
    this._instance.maxDistance = 980;
    this.pane.addBinding(this._instance, 'autoRotate', {
      label: '自动旋转',
    });
  }
}
