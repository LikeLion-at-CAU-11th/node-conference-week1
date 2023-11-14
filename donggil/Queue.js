export class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    const cur = this.items.shift();
    if (cur === undefined) throw new Error('큐가 비었습니다.');
    return cur;
  }

  peek() {
    return this.items[0];
  }

  getSize() {
    return this.items.length;
  }

  isEmpty() {
    return this.getSize() === 0;
  }
}
