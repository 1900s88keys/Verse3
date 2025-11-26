import { Object3D } from 'three';

import type { Setting } from '../setting/Setting';

export class FlightRoutes extends Object3D {
  private setting: Setting;

  constructor({ setting }: { setting: Setting }) {
    super();
    this.name = 'FlightRoutes';
    this.setting = setting;
  }
}
