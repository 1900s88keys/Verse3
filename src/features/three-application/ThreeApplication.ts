import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';

import { Camera } from './camera/Camera';
import { CameraControl } from './camera/CameraControl';
import { Light } from './light/Light';
import { Renderer } from './renderer/Renderer';
import { Scene } from './scene/Scene';
import { Sizes } from './sizes/Sizes';
import { Ticker } from './ticker/Ticker';

export class ThreeApplication {
  containerElement?: HTMLElement;

  canvas: HTMLCanvasElement;

  stats: Stats;

  pane: Pane;

  sizes: Sizes;

  ticker: Ticker;

  renderer: Renderer;

  camera: Camera;

  cameraControl: CameraControl;

  scene: Scene;

  light: Light;

  constructor() {
    this.canvas = document.createElement('canvas');

    this.pane = new Pane({
      title: '3D场景控制',
      expanded: true,
    });

    this.stats = new Stats();

    this.sizes = new Sizes();

    this.ticker = new Ticker();

    this.renderer = new Renderer({ canvas: this.canvas, sizes: this.sizes });

    this.camera = new Camera({ sizes: this.sizes });

    this.cameraControl = new CameraControl({
      pane: this.pane,
      canvas: this.canvas,
      camera: this.camera.instance,
    });

    this.scene = new Scene({
      pane: this.pane,
    });

    this.light = new Light({
      pane: this.pane,
    });

    this.scene.instance.add(this.light.instance);

    this.bindEvent();
  }

  private bindEvent() {
    this.ticker.on('tick', this.handleTick);
  }

  private unbindEvent() {
    this.ticker.off('tick', this.handleTick);
  }

  private handleTick = () => {
    this.renderer.instance.render(this.scene.instance, this.camera.instance);
    this.stats.update();
  };

  public init(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.containerElement.appendChild(this.canvas);

    this.sizes.init(this.containerElement);

    this.containerElement.appendChild(this.pane.element);
    this.pane.element.style.position = 'absolute';
    this.pane.element.style.top = '2px';
    this.pane.element.style.right = '2px';

    this.containerElement.appendChild(this.stats.dom);
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.top = '2px';
    this.stats.dom.style.left = '2px';

    this.ticker.start();
  }

  public destroy() {
    this.unbindEvent();
    this.ticker.destroy();

    this.pane.dispose();
    this.sizes.destroy();

    this.renderer.destroy();
    this.camera.destroy();
    this.scene.destroy();

    this.containerElement?.removeChild(this.canvas);
    this.containerElement?.removeChild(this.stats.dom);
    this.containerElement?.removeChild(this.pane.element);
    this.containerElement = undefined;
  }
}
