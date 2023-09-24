const { emitter } = require("./emitter");
const { Status } = require("./Status");

class Server {
  constructor(restaurant) {
    this.serverQueue = [];
    this.isServing = false;
    this.workplace = restaurant;
  }
  advanceServerQueue() {
    if (this.serverQueue.length > 0 && !this.isServing) {
      this.isServing = true;
      const currentOrder = this.serverQueue[0];
      currentOrder.menuStatus = Status.SERVING;

      setTimeout(() => {
        currentOrder.menuStatus = Status.SERVED;
        this.isServing = false;
        this.workplace.giveOrderToFinishedQueue(currentOrder);
        this.serverQueue.shift();
        emitter.emit("serveDone");
      }, currentOrder.getSize() * 1000);
    }
  }
}
exports.Server = Server;
