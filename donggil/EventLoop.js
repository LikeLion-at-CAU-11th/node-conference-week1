import { Queue } from './Queue.js';

export class EventLoop {
  #timer;
  #queue;
  #action;

  constructor(action) {
    this.#queue = new Queue();
    this.#action = action;
  }

  init() {
    this.#timer = setInterval(() => {
      if (!this.#queue.isEmpty()) {
        const value = this.#queue.dequeue();
        this.#action(value);
      }
    }, 1000);
  }

  end() {
    clearInterval(this.#timer);
  }

  add(value) {
    this.#queue.enqueue(value);
  }
}
