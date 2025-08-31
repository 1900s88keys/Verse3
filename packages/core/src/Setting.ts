import type { WebGLRendererParameters } from 'three';
import { EventEmitter } from '@verse3/common';

interface Events {
  update: (newValue: SettingValue, key: keyof SettingValue) => void;
}

export class Setting {
  private eventEmitter = new EventEmitter<Events>();

  private value = {
    WebGLRendererParameters: {
      antialias: true,
      alpha: false,
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    } as WebGLRendererParameters,
  };

  getAttrs(): SettingValue {
    return { ...this.value };
  }

  set<K extends keyof SettingValue>(key: K, value: SettingValue[K]): void {
    this.value[key] = value;
    this.eventEmitter.emit('update', this.getAttrs(), key);
  }

  get<K extends keyof SettingValue>(key: K): SettingValue[K] {
    return this.value[key];
  }

  on<K extends keyof Events>(eventName: K, handler: Events[K]): void {
    this.eventEmitter.on(eventName, handler);
  }

  off<K extends keyof Events>(eventName: K, handler: Events[K]): void {
    this.eventEmitter.off(eventName, handler);
  }

  destroy(): void {
    // 清理事件发射器
    if (this.eventEmitter) {
      // 移除所有事件监听器
      this.eventEmitter.off('update', () => {});
      
      // 清理事件映射 - 使用类型安全的清理方式
      const emitter = this.eventEmitter as unknown as { eventMap?: Record<string, unknown> };
      if (emitter.eventMap) {
        emitter.eventMap = {};
      }
    }
  }
}

export type SettingValue = Setting['value'];