import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Editor } from './Editor';

export class CameraControl {
  camera: PerspectiveCamera;
  
  controls: OrbitControls;

  constructor(private editor: Editor) {
    // 创建相机
    const fov = 75;
    const aspect = this.editor.containerElement.clientWidth / this.editor.containerElement.clientHeight;
    const near = 0.01;
    const far = 1000;
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    
    // 设置相机初始位置
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    
    // 创建轨道控制器
    this.controls = new OrbitControls(this.camera, this.editor.containerElement);
    
    // 配置控制器选项
    this.setupControls();
  }

  private setupControls(): void {
    // 启用阻尼效果，使相机移动更平滑
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // 设置缩放限制
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 100;
    
    // 设置垂直旋转限制（防止相机翻转）
    this.controls.minPolarAngle = 0; // 0度（顶部）
    this.controls.maxPolarAngle = Math.PI; // 180度（底部）
    
    // 设置水平旋转限制（可选，设置为false允许无限旋转）
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    
    // 启用平移（右键拖拽）
    this.controls.enablePan = true;
    
    // 设置平移速度
    this.controls.panSpeed = 1.0;
    
    // 设置缩放速度
    this.controls.zoomSpeed = 1.0;
    
    // 设置旋转速度
    this.controls.rotateSpeed = 1.0;
    
    // 设置目标点（相机围绕旋转的中心点）
    this.controls.target.set(0, 0, 0);
    
    // 启用自动旋转（可选，默认关闭）
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 2.0;
  }

  // 设置相机位置
  setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
    this.controls.update();
  }

  // 设置相机目标点
  setTarget(x: number, y: number, z: number): void {
    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  // 重置相机到初始状态
  reset(): void {
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.controls.reset();
  }

  // 启用/禁用自动旋转
  setAutoRotate(enabled: boolean): void {
    this.controls.autoRotate = enabled;
  }

  // 设置自动旋转速度
  setAutoRotateSpeed(speed: number): void {
    this.controls.autoRotateSpeed = speed;
  }

  // 获取当前相机状态
  getCameraState() {
    return {
      position: this.camera.position.clone(),
      target: this.controls.target.clone(),
      fov: this.camera.fov,
      near: this.camera.near,
      far: this.camera.far
    };
  }

  // 更新控制器（在渲染循环中调用）
  update(): void {
    this.controls.update();
  }

  // 更新相机宽高比（由RendererManager调用）
  updateAspect(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  destroy(): void {
    // 销毁控制器
    if (this.controls) {
      this.controls.dispose();
    }
    
    // 清理相机对象
    if (this.camera) {
      // 移除相机的所有子对象
      this.camera.removeFromParent();
      
      // 清理相机的矩阵
      this.camera.matrixWorldInverse.identity();
      this.camera.matrixWorld.identity();
      this.camera.projectionMatrix.identity();
      this.camera.projectionMatrixInverse.identity();
    }
    
    // 清理引用 - 使用undefined而不是null as any
    this.camera = undefined as unknown as PerspectiveCamera;
    this.controls = undefined as unknown as OrbitControls;
  }
} 
