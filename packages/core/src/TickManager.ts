import { EventEmitter } from '@verse3/common';
import { Editor } from './Editor';

interface Events {
  tick: (e: { time: number; delta: number }) => void;
}

export class TickManager {
  private eventEmitter: EventEmitter<Events>;

  private lastTime: number = 0;

  private tickId: number = -1;

  constructor(private editor: Editor) {
    this.eventEmitter = new EventEmitter<Events>();
    this.animate(0);
  }

  private animate = (time: number): void => {
    cancelAnimationFrame(this.tickId);
    this.update(time);
    this.tickId = requestAnimationFrame(this.animate);
  }

  private update(time: number): void {
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.eventEmitter.emit('tick', { time, delta });
  }

  on<K extends keyof Events>(eventName: K, handler: Events[K]): void {
    this.eventEmitter.on(eventName, handler);
  }

  off<K extends keyof Events>(eventName: K, handler: Events[K]): void {
    this.eventEmitter.off(eventName, handler);
  }

  destroy(): void {
    // 停止动画循环
    cancelAnimationFrame(this.tickId);
    
    // 清理事件发射器
    if (this.eventEmitter) {
      // 移除所有事件监听器
      this.eventEmitter.off('tick', () => {});
      
      // 清理事件映射 - 使用类型安全的清理方式
      const emitter = this.eventEmitter as unknown as { eventMap?: Record<string, unknown> };
      if (emitter.eventMap) {
        emitter.eventMap = {};
      }
    }
    
    this.lastTime = 0;
  }
}
