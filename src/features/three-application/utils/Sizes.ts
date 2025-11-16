import { EventEmitter } from '@/shared/utils/event-emitter/EventEmitter';

interface Events {
  resize: (width: number, height: number) => void;
}

export class Sizes extends EventEmitter<Events> {
  constructor() {
    super();
    this.bindEvents();
  }

  private bindEvents = () => {
    window.addEventListener('resize', this.handleResize);
  };

  private unbindEvents = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  handleResize = () => {
    this.emit('resize', window.innerWidth, window.innerHeight);
  };

  destroy() {
    this.unbindEvents();
    this.clear();
  }
}
