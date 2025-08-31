import { WebGLRenderer } from 'three';
import { Editor } from './Editor';

export class RendererManager {
  renderer: WebGLRenderer;
  
  constructor(private editor: Editor) {
    this.renderer = new WebGLRenderer({
      canvas: this.editor.canvasElement,
      ...this.editor.setting.get('WebGLRendererParameters'),
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.editor.containerElement.clientWidth * this.renderer.getPixelRatio(),
      this.editor.containerElement.clientHeight * this.renderer.getPixelRatio(),
      false
    );

    this.bindEvent();
  }

  private bindEvent = (): void => {
    this.editor.tickManager.on('tick', this.onTick);
    window.addEventListener('resize', this.handleResize);
  };

  private unbindEvent = (): void => {
    this.editor.tickManager.off('tick', this.onTick);
    window.removeEventListener('resize', this.handleResize);
  };


  private handleResize(): void {
    const container = this.editor.containerElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // 更新渲染器尺寸
    this.renderer.setSize(
      width * this.renderer.getPixelRatio(),
      height * this.renderer.getPixelRatio(),
      false
    );
    
    // 更新相机宽高比
    this.editor.cameraControl.updateAspect(width, height);
  }

  private onTick = (): void => {
    this.editor.cameraControl.controls.update();
    this.renderer.render(
      this.editor.sceneManager.scene,
      this.editor.cameraControl.camera
    );
  };

  destroy(): void {
    this.unbindEvent();
    
    // 清理WebGL上下文
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement = undefined as unknown as HTMLCanvasElement;
    }
    
    // 清理引用 - 使用undefined而不是null as any
    this.renderer = undefined as unknown as WebGLRenderer;
  }
}
