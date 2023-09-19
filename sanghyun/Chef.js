const { emitter } = require("./emitter");
const { Status } = require("./Status");

class Chef {
  constructor(restaurant) {
    this.chefQueue = [];
    this.isCooking = false;
    this.workplace = restaurant;
  }
  advanceChefQueue() {
    if (this.chefQueue.length > 0 && !this.isCooking) {
      this.isCooking = true;
      const currentOrder = this.chefQueue[0];
      currentOrder.menuStatus = Status.COOKING;

      setTimeout(() => {
        currentOrder.menuStatus = Status.COOKED;
        this.workplace.giveOrderToServer(currentOrder);
        this.chefQueue.shift();
        this.isCooking = false;
        emitter.emit("cookDone");
      }, currentOrder.getSize() * 1000);
    }
  }
}

exports.Chef = Chef;