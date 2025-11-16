import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { Renderer } from './renderer/Renderer';
import { Sizes } from './utils/Sizes';

export class ThreeApplication {
  containerElement?: HTMLElement;

  canvas: HTMLCanvasElement;

  stats: Stats;

  gui: GUI;

  sizes: Sizes;

  renderer: Renderer;

  constructor() {
    this.canvas = document.createElement('canvas');

    this.gui = new GUI();
    this.stats = new Stats();

    this.sizes = new Sizes();

    this.renderer = new Renderer({ canvas: this.canvas, sizes: this.sizes });
  }

  init(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.containerElement.appendChild(this.canvas);

    this.containerElement.appendChild(this.gui.domElement);
    this.gui.domElement.style.position = 'absolute';
    this.gui.domElement.style.right = '2px';
    this.gui.domElement.style.top = '2px';

    this.containerElement.appendChild(this.stats.dom);
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.top = '2px';
    this.stats.dom.style.left = '2px';
  }

  destroy() {
    this.gui.destroy();
    this.sizes.destroy();
    this.renderer.destroy();

    this.containerElement?.removeChild(this.canvas);
    this.containerElement?.removeChild(this.stats.dom);
    this.containerElement = undefined;
  }
}
