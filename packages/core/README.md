# @verse3/core

3D编辑器核心引擎包，提供完整的Three.js场景管理、渲染和销毁功能。

## 核心类

### Editor
主要的编辑器类，协调所有管理器的工作。

**销毁方法**: `destroy()`
- 按依赖顺序销毁所有管理器
- 清理DOM元素（Canvas）
- 清理所有对象引用

**使用示例**:
```typescript
const editor = new Editor({ containerElement: document.body });

// 使用完毕后销毁
editor.destroy();
```

### TickManager
管理动画循环和事件分发。

**销毁方法**: `destroy()`
- 停止requestAnimationFrame循环
- 清理事件发射器
- 重置时间状态

### RendererManager
管理WebGL渲染器。

**销毁方法**: `destroy()`
- 移除事件监听器
- 调用WebGL渲染器的dispose()方法
- 强制上下文丢失
- 清理DOM元素引用

### SceneManager
管理Three.js场景和对象。

**销毁方法**: `destroy()`
- 递归清理场景中的所有对象
- 销毁几何体和材质
- 清空场景
- 清理对象引用

### CameraControl
管理相机和轨道控制器，提供完整的相机控制功能。

**主要功能**:
- 鼠标拖拽旋转视角
- 滚轮缩放
- 右键拖拽平移
- 键盘控制
- 触摸设备支持
- 自动旋转
- 相机位置和目标点设置

**销毁方法**: `destroy()`
- 移除事件监听器
- 销毁轨道控制器
- 从父对象中移除相机
- 重置相机矩阵
- 清理引用

**使用示例**:
```typescript
const cameraControl = editor.cameraControl;

// 设置相机位置
cameraControl.setPosition(10, 10, 10);

// 设置相机目标点
cameraControl.setTarget(0, 0, 0);

// 启用自动旋转
cameraControl.setAutoRotate(true);

// 重置相机
cameraControl.reset();

// 获取相机状态
const state = cameraControl.getCameraState();
```

**控制方式**:
- **鼠标左键拖拽**: 旋转相机视角
- **鼠标右键拖拽**: 平移相机（移动目标点）
- **鼠标滚轮**: 缩放相机（拉近/拉远）
- **触摸设备**: 单指拖拽旋转，双指拖拽平移，捏合手势缩放

### Setting
管理配置和事件。

**销毁方法**: `destroy()`
- 清理事件发射器
- 移除所有事件监听器
- 清理配置值

## 销毁顺序

销毁时必须按照以下顺序进行，以避免依赖问题：

1. **TickManager** - 停止动画循环
2. **RendererManager** - 清理渲染器和事件
3. **SceneManager** - 清理场景对象
4. **CameraControl** - 清理相机和控制器
5. **Setting** - 清理配置和事件

## 内存管理

### Three.js资源清理
- **几何体**: 调用`geometry.dispose()`释放GPU内存
- **材质**: 调用`material.dispose()`释放纹理和着色器
- **渲染器**: 调用`renderer.dispose()`释放WebGL上下文
- **控制器**: 调用`controls.dispose()`释放事件监听器

### 事件清理
- 移除所有事件监听器
- 清理事件映射表
- 避免内存泄漏

### 引用清理
- 将所有对象引用设置为undefined
- 帮助垃圾回收器识别可回收对象

## 最佳实践

### 1. 及时销毁
```typescript
// 在组件卸载时立即销毁
onUnmounted(() => {
  editor.destroy();
});
```

### 2. 检查状态
```typescript
destroy() {
  if (this.isDestroyed) return;
  this.isDestroyed = true;
  
  // 执行销毁逻辑
}
```

### 3. 错误处理
```typescript
destroy() {
  try {
    // 销毁逻辑
  } catch (error) {
    console.error('销毁过程中发生错误:', error);
  } finally {
    // 确保引用被清理
    this.cleanupReferences();
  }
}
```

### 4. 性能监控
```typescript
destroy() {
  const startTime = performance.now();
  
  // 执行销毁逻辑
  
  const endTime = performance.now();
  console.log(`销毁耗时: ${endTime - startTime}ms`);
}
```

### 5. 相机控制优化
```typescript
// 在渲染循环中更新控制器
editor.tickManager.on('tick', () => {
  cameraControl.update(); // 确保控制器状态更新
});

// 响应式相机设置
window.addEventListener('resize', () => {
  cameraControl.camera.aspect = window.innerWidth / window.innerHeight;
  cameraControl.camera.updateProjectionMatrix();
});
```

## 注意事项

1. **不要重复销毁**: 确保每个对象只被销毁一次
2. **依赖顺序**: 严格按照依赖顺序进行销毁
3. **异步操作**: 如果有异步操作，确保在销毁前完成
4. **事件监听器**: 确保所有事件监听器都被正确移除
5. **WebGL上下文**: 在销毁渲染器后，WebGL上下文将不可用
6. **相机控制器**: 确保在销毁前调用`controls.dispose()`

## 故障排除

### 常见问题

1. **WebGL错误**: 确保在销毁渲染器后不再调用渲染方法
2. **内存泄漏**: 检查是否所有事件监听器都被移除
3. **性能问题**: 确保几何体和材质被正确销毁
4. **相机控制问题**: 确保在渲染循环中调用`cameraControl.update()`

### 调试技巧

```typescript
// 启用调试模式
const editor = new Editor({ 
  containerElement: document.body,
  debug: true 
});

// 在销毁时输出详细信息
editor.destroy();
console.log('编辑器已销毁');

// 检查相机状态
console.log('相机状态:', editor.cameraControl.getCameraState());
```

