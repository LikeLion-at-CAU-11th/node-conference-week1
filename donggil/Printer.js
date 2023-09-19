import { EventLoop } from './EventLoop.js';

export class Printer {
  #eventLoop;
  constructor() {
    const print = (value) => {
      console.log(value);
    };

    this.#eventLoop = new EventLoop(print);
    this.#eventLoop.init();
  }
  add(value) {
    this.#eventLoop.add(value);
  }
}
