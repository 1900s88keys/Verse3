import { Editor } from '../src/Editor';

// 相机控制使用示例
export function cameraControlExample() {
  // 创建编辑器实例
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  const editor = new Editor({ containerElement: container });
  
  // 获取相机控制器
  const cameraControl = editor.cameraControl;
  
  // 1. 基本相机控制功能
  console.log('相机初始状态:', cameraControl.getCameraState());
  
  // 2. 设置相机位置
  cameraControl.setPosition(10, 10, 10);
  
  // 3. 设置相机目标点
  cameraControl.setTarget(0, 0, 0);
  
  // 4. 启用自动旋转
  cameraControl.setAutoRotate(true);
  cameraControl.setAutoRotateSpeed(1.0);
  
  // 5. 重置相机到初始状态
  setTimeout(() => {
    cameraControl.reset();
    console.log('相机重置后状态:', cameraControl.getCameraState());
  }, 3000);
  
  // 6. 禁用自动旋转
  setTimeout(() => {
    cameraControl.setAutoRotate(false);
  }, 6000);
  
  // 7. 动态调整相机位置
  let angle = 0;
  const animateCamera = () => {
    angle += 0.01;
    const radius = 15;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    cameraControl.setPosition(x, 10, z);
    
    requestAnimationFrame(animateCamera);
  };
  
  // 8. 开始相机动画
  setTimeout(() => {
    animateCamera();
  }, 9000);
  
  // 9. 在渲染循环中更新控制器
  editor.tickManager.on('tick', () => {
    cameraControl.update(); // 确保控制器状态更新
  });
  
  // 10. 清理资源
  setTimeout(() => {
    editor.destroy();
    document.body.removeChild(container);
  }, 15000);
  
  return editor;
}

// 相机控制器的鼠标和键盘操作说明
export const cameraControlsGuide = {
  // 鼠标左键拖拽：旋转相机视角
  leftMouseDrag: 'Rotate camera view',
  
  // 鼠标右键拖拽：平移相机（移动目标点）
  rightMouseDrag: 'Pan camera (move target point)',
  
  // 鼠标滚轮：缩放相机（拉近/拉远）
  mouseWheel: 'Zoom camera in/out',
  
  // 键盘控制（如果启用）
  keyboardControls: {
    arrowKeys: 'Pan camera',
    pageUp: 'Zoom in',
    pageDown: 'Zoom out',
    home: 'Reset camera to initial position'
  },
  
  // 触摸控制（移动设备）
  touchControls: {
    singleFingerDrag: 'Rotate camera view',
    twoFingerDrag: 'Pan camera',
    pinchGesture: 'Zoom camera'
  }
};

// 相机控制器的配置选项说明
export const cameraControlsOptions = {
  // 阻尼效果
  enableDamping: 'Smooth camera movement with damping effect',
  dampingFactor: 'Damping factor (0.05 = smooth, 0.1 = responsive)',
  
  // 距离限制
  minDistance: 'Minimum zoom distance (0.1 = very close)',
  maxDistance: 'Maximum zoom distance (100 = very far)',
  
  // 旋转限制
  minPolarAngle: 'Minimum vertical rotation (0 = top view)',
  maxPolarAngle: 'Maximum vertical rotation (π = bottom view)',
  minAzimuthAngle: 'Minimum horizontal rotation (-∞ = unlimited)',
  maxAzimuthAngle: 'Maximum horizontal rotation (∞ = unlimited)',
  
  // 平移设置
  enablePan: 'Enable camera panning with right mouse button',
  panSpeed: 'Pan speed multiplier (1.0 = normal speed)',
  
  // 缩放设置
  zoomSpeed: 'Zoom speed multiplier (1.0 = normal speed)',
  
  // 旋转设置
  rotateSpeed: 'Rotation speed multiplier (1.0 = normal speed)',
  
  // 自动旋转
  autoRotate: 'Enable automatic camera rotation',
  autoRotateSpeed: 'Auto-rotation speed (positive = clockwise)'
};
