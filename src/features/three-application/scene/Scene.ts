import {
  Color,
  EquirectangularReflectionMapping,
  Scene as ThreeScene,
} from 'three';
import { HDRLoader } from 'three/examples/jsm/Addons.js';

import { sceneSetting } from '../setting/Setting';

import type { FolderApi, Pane } from 'tweakpane';

export class Scene {
  private _instance: ThreeScene;

  private sceneFolder: FolderApi;

  get instance() {
    return this._instance;
  }

  constructor({ pane }: { pane: Pane }) {
    this._instance = new ThreeScene();
    this._instance.background = new Color(sceneSetting.bgColor);
    this._instance.backgroundBlurriness = 1;
    const envMapUrl = '/texture/royal_esplanade_1k.hdr';
    const envMap = new HDRLoader().load(envMapUrl, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      this._instance.environment = texture;
      this._instance.environmentIntensity = 1;
      this._instance.background = texture;
    });
    this.sceneFolder = pane.addFolder({ title: 'Scene' });
    this.sceneFolder.expanded = false;
    this.sceneFolder.addBinding(this._instance, 'backgroundBlurriness', {
      step: 0.1,
      min: 0,
      max: 2,
    });
    this.sceneFolder.addBinding(sceneSetting, 'bgColor').on('change', (ev) => {
      this._instance.background = new Color(ev.value);
    });
    this.sceneFolder
      .addBinding(sceneSetting, 'backgroundType', {
        options: { envMap: 'envMap', color: 'color' },
      })
      .on('change', (ev) => {
        if (ev.value === 'envMap') {
          this._instance.background = envMap;
        } else {
          this._instance.background = new Color(sceneSetting.bgColor);
        }
      });
  }

  destroy() {
    this._instance.clear();
  }
}
