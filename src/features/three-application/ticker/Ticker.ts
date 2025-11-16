import { EventEmitter } from '@/shared/utils/Utils';

interface Events {
  tick: (deltaTime: number) => void;
}

export class Ticker extends EventEmitter<Events> {}
