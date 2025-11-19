import { WebGLRenderer } from 'three';

import type { Sizes } from '../sizes/Sizes';

export class Renderer {
  private _instance: WebGLRenderer;

  private sizes: Sizes;

  get instance() {
    return this._instance;
  }
  constructor({
    canvas,
    sizes,
  }: {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    sizes: Sizes;
  }) {
    this.sizes = sizes;
    this._instance = new WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this._instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.bindEvent();
  }

  private bindEvent() {
    this.sizes.on('resize', this.handleResize);
  }

  private unbindEvent() {
    this.sizes.off('resize', this.handleResize);
  }

  private handleResize = (width: number, height: number) => {
    this._instance.setSize(width, height);
  };

  destroy() {
    this.unbindEvent();
    this._instance.dispose();
  }
}
