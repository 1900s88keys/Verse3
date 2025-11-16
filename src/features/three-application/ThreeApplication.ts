import { Scene } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { Camera } from './camera/Camera';
import { Renderer } from './renderer/Renderer';
import { Sizes } from './sizes/Sizes';
import { Ticker } from './ticker/Ticker';

export class ThreeApplication {
  containerElement?: HTMLElement;

  canvas: HTMLCanvasElement;

  stats: Stats;

  gui: GUI;

  sizes: Sizes;

  ticker: Ticker;

  renderer: Renderer;

  camera: Camera;

  scene: Scene;

  constructor() {
    this.canvas = document.createElement('canvas');

    this.gui = new GUI();
    this.stats = new Stats();

    this.sizes = new Sizes();
    this.ticker = new Ticker();

    this.renderer = new Renderer({ canvas: this.canvas, sizes: this.sizes });
    this.camera = new Camera({ sizes: this.sizes });

    this.scene = new Scene();

    this.bindEvent();
  }

  init(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.containerElement.appendChild(this.canvas);

    this.sizes.init(this.containerElement);

    this.containerElement.appendChild(this.gui.domElement);
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.right = '2px';
    this.gui.domElement.style.top = '2px';

    this.containerElement.appendChild(this.stats.dom);
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.top = '2px';
    this.stats.dom.style.left = '2px';

    this.ticker.start();
  }

  bindEvent() {
    this.ticker.on('tick', this.handleTick);
  }

  unbindEvent() {
    this.ticker.off('tick', this.handleTick);
  }

  handleTick = () => {
    this.renderer.instance.render(this.scene, this.camera.instance);
    this.stats.update();
  };

  destroy() {
    this.unbindEvent();
    this.ticker.destroy();

    this.gui.destroy();
    this.sizes.destroy();

    this.renderer.destroy();
    this.camera.destroy();
    this.scene.clear();

    this.containerElement?.removeChild(this.canvas);
    this.containerElement?.removeChild(this.stats.dom);
    this.containerElement = undefined;
  }
}
