import { EventEmitter } from '@/shared/utils/Utils';

interface Events {
  resize: (width: number, height: number) => void;
}

export class Sizes extends EventEmitter<Events> {
  private containerElement?: HTMLElement;

  width: number;

  height: number;

  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  private bindEvents = () => {
    this.containerElement?.addEventListener('resize', this.handleResize);
  };

  private unbindEvents = () => {
    this.containerElement?.removeEventListener('resize', this.handleResize);
  };

  init(containerElement: HTMLElement) {
    this.containerElement = containerElement;
    this.bindEvents();
    this.handleResize();
  }

  handleResize = () => {
    this.width = this.containerElement?.offsetWidth || window.innerWidth;
    this.height = this.containerElement?.offsetHeight || window.innerHeight;
    this.emit('resize', this.width, this.height);
  };

  destroy() {
    this.unbindEvents();
    this.clear();
  }
}
