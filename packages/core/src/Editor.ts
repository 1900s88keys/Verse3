import { Setting } from './Setting';
import { SceneManager } from './SceneManager';
import { RendererManager } from './RendererManager';
import { TickManager } from './TickManager';
import { CameraControl } from './CameraControl';

export interface IEditorOptions {
  containerElement: HTMLDivElement;
}

export class Editor {
  containerElement: HTMLDivElement;

  canvasElement: HTMLCanvasElement;

  setting: Setting;

  cameraControl: CameraControl;

  sceneManager: SceneManager;

  rendererManager: RendererManager;
  
  tickManager: TickManager;

  constructor(options: IEditorOptions) {
    this.containerElement = options.containerElement;
    this.canvasElement = document.createElement('canvas');
    this.containerElement.appendChild(this.canvasElement);
    
    this.tickManager = new TickManager(this);

    this.setting = new Setting();

    this.cameraControl = new CameraControl(this);

    this.rendererManager = new RendererManager(this);

    this.sceneManager = new SceneManager(this);
  }

  destroy(): void {
    // 清理DOM元素
    this.containerElement.removeChild(this.canvasElement);

    // 按依赖顺序销毁各个管理器
    this.tickManager.destroy();
    this.cameraControl.destroy();
    this.sceneManager.destroy();
    this.setting.destroy();
    this.rendererManager.destroy();
    
    // 清理引用 - 使用undefined而不是null as any
    this.tickManager = undefined as unknown as TickManager;
    this.containerElement = undefined as unknown as HTMLDivElement;
    this.canvasElement = undefined as unknown as HTMLCanvasElement;
    this.setting = undefined as unknown as Setting;
    this.cameraControl = undefined as unknown as CameraControl;
    this.sceneManager = undefined as unknown as SceneManager;
    this.rendererManager = undefined as unknown as RendererManager;
  }
}
