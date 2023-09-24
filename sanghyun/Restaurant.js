const { emitter } = require("./emitter");
const { Order } = require("./Order");

const { Chef } = require("./Chef");
const { Server } = require("./Server");

class Restaurant {
  constructor() {
    this.chefs = [];
    this.servers = [];
    this.finishedQueue = [];
  }
  hireChef(){
    this.chefs.push(new Chef(this));
  }
  hireServer(){
    this.servers.push(new Server(this));
  }
  createOrder(orderString) {
    const quantity = parseInt(orderString.trim().split(",")[1].split(":")[1]);
    for (let j = 0; j < quantity; j++) {
      this.giveOrderToChef(new Order(orderString));
    }
    emitter.emit("newOrder");
  }
  advanceChefQueue() {
    // 요리사 1명인 경우만 가정할 것이므로, 어느 요리사에게 요리를 맡길지는 고려하지 않는다
    this.chooseChef().advanceChefQueue();
  }
  advanceServerQueue() {
    // 홀알바 1명인 경우만 가정할 것이므로, 어느 홀알바에게 서빙을 맡길지는 고려하지 않는다
    this.chooseServer().advanceServerQueue();
  }

  chooseChef() {
    // 필요하다면 여기에 로드 밸런싱 로직이 들어갈 것
    return this.chefs[0];
  }

  chooseServer() {
    // 필요하다면 여기에 로드 밸런싱 로직이 들어갈 것
    return this.servers[0];
  }

  giveOrderToChef(order) {
    this.chooseChef().chefQueue.push(order);
  }

  giveOrderToServer(order) {
    this.chooseServer().serverQueue.push(order);
  }

  giveOrderToFinishedQueue(order) {
    this.finishedQueue.push(order);
  }

  chefIsCooking() {
    return this.chooseChef().isCooking;
  }

  serverIsServing() {
    return this.chooseServer().isServing;
  }

  serverHasWorkToDo() {
    return this.servers[0].serverQueue.length > 0;
  }

  printAllQueues() {
    const chefQueue = this.chefs[0].chefQueue;
    const serverQueue = this.servers[0].serverQueue;

    for (let i = 0; i < chefQueue.length; i++) { // 요리사 큐
      chefQueue[i].printStatus();
    }
    for (let i = 0; i < serverQueue.length; i++) { // 홀알바 큐
      serverQueue[i].printStatus();
    }
    for (let i = 0; i < this.finishedQueue.length; i++) { // 완성된 요리 큐
      this.finishedQueue[i].printStatus();
    }
  }
}

module.exports.Restaurant = Restaurant;