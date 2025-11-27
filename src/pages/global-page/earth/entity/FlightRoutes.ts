import { Object3D } from 'three';

import type {
  Resource,
  ResourceLoader,
  ResourceData,
} from '@/features/three-application/resource-loader/ResourceLoader';

import type { Setting } from '../setting/Setting';
import type { GLTF } from 'three/examples/jsm/Addons.js';

export class FlightRoutes extends Object3D {
  private setting: Setting;

  private resourceLoader: ResourceLoader;

  constructor({
    setting,
    resourceLoader,
  }: {
    setting: Setting;
    resourceLoader: ResourceLoader;
  }) {
    super();
    this.name = 'FlightRoutes';
    this.setting = setting;
    this.resourceLoader = resourceLoader;
    this.bindEvent();
  }

  bindEvent() {
    this.resourceLoader.on('fileLoadEnd', this.loadAirplaneModel);
  }

  /**
   * 加载飞机模型
   */
  async loadAirplaneModel(resource: Resource, gltf: ResourceData) {
    if (resource.name !== 'airplaneModel') {
      return;
    }

    const airplane = (gltf as GLTF).scene.clone();
    airplane.name = 'airplane';

    // 确保材质正确设置
    airplane.traverse((child) => {
      if (child.isObject3D) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }
}
