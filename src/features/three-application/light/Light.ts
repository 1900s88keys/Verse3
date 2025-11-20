import { AmbientLight, DirectionalLight, Object3D } from 'three';

import type { FolderApi, Pane } from 'tweakpane';

export class Light {
  private _instance: Object3D;

  private sceneFolder: FolderApi;

  private ambientLight: AmbientLight;

  private directionalLight: DirectionalLight;

  get instance() {
    return this._instance;
  }

  constructor({ pane }: { pane: Pane }) {
    this._instance = new Object3D();
    this.ambientLight = new AmbientLight(0xffffff, 1);
    this._instance.add(this.ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 3);
    this.directionalLight.castShadow = false;
    this.directionalLight.position.set(-3, 2, -1);
    this._instance.add(this.directionalLight);

    this.sceneFolder = pane.addFolder({ title: 'Light' });
    this.sceneFolder.addBinding(this.directionalLight, 'intensity', {
      step: 0.1,
      min: 0.1,
      max: 10,
      label: 'directionalIntensity',
    });
    this.sceneFolder.addBinding(this.ambientLight, 'intensity', {
      step: 0.1,
      min: 0.1,
      max: 5,
      label: 'ambientIntensity',
    });
  }
}
