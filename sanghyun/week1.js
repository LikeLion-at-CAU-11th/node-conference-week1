const readline = require("readline");
const EventEmitter = require("events");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const emitter = new EventEmitter();

const Status={
  WAITING: 0,
  COOKING: 1,
  COOKED: 2,
  SERVING: 3,
  SERVED: 4,
}

function getUserInput(restaurant) {
  rl.question("", (input) => {
    console.log(`${input} 주문이요~~~`);
    restaurant.createOrder(input);
    process.nextTick(() => getUserInput(restaurant)); // 마이크로 태스크
  });
}

function staticTimeCounter(){ // 전역변수 사용X, 클로져 활용
  let count = 0;
  const counter = function () { count += 1; return count; }
  return counter;
}

class Order{
  constructor(inputString){
    this.menu = inputString.trim().split(",")[0];
    this.size = parseInt(inputString.trim().split(",")[1].split(":")[0]);
    this.menuStatus = Status.WAITING;
  }
  sizeToString(){
    const sizeMap = {
      1: "소형",
      2: "중형",
      3: "대형",
    };
    return sizeMap[this.size]
  }
  menuStatusToString() {
    const statusMap = {
      [Status.WAITING]: "요리대기",
      [Status.COOKING]: "요리중",
      [Status.COOKED]: "요리완료/서빙대기",
      [Status.SERVING]: "서빙중",
      [Status.SERVED]: "서빙완료!",
    };
    return statusMap[this.menuStatus];
  }
  getSize(){
    return this.size;
  }
  printStatus(){
    console.log(`${this.menu} (${this.sizeToString()}): ${this.menuStatusToString()}`);
  }
}

class Restaurant{
  constructor(){
    this.chefQueue = [];
    this.serverQueue = [];
    this.finishedQueue = [];
    this.isCooking = false;
    this.isServing = false;
  }
  createOrder(orderString){ // 사장님
    const quantity = parseInt(orderString.trim().split(",")[1].split(":")[1]);
    for (let j = 0; j < quantity; j++){
      this.chefQueue.push(new Order(orderString));
    }
    emitter.emit("newOrder");
  }
  advanceChefQueue(){ // 요리사
    if (this.chefQueue.length > 0 && !this.isCooking){
      this.isCooking = true;
      const currentOrder = this.chefQueue[0];
      currentOrder.menuStatus = Status.COOKING;

      setTimeout(() => { // 요리시간
        currentOrder.menuStatus = Status.COOKED;
        this.serverQueue.push(this.chefQueue.shift());
        this.isCooking = false;
        emitter.emit("cookDone");
      }, currentOrder.getSize() * 1000);
    }
  }
  advanceServerQueue(){ // 홀알바
    if (this.serverQueue.length > 0 && !this.isServing){
      this.isServing = true;
      const currentOrder = this.serverQueue[0]
      currentOrder.menuStatus = Status.SERVING;

      setTimeout(() => { // 서빙시간
        currentOrder.menuStatus = Status.SERVED;
        this.isServing = false;
        this.finishedQueue.push(this.serverQueue.shift());
        emitter.emit("serveDone");
      }, currentOrder.getSize() * 1000);
    }
  }
  printAllQueues(){
    for (let i = 0; i < this.chefQueue.length; i++){ // 요리사 큐
      restaurant.chefQueue[i].printStatus();
    } 
    for (let i = 0; i < this.serverQueue.length; i++){ // 홀알바 큐
      restaurant.serverQueue[i].printStatus();
    }
    for (let i = 0; i < this.finishedQueue.length; i++){ // 완성된 요리 큐
      restaurant.finishedQueue[i].printStatus();
    }
  }
  getChefQueue(){
    return this.chefQueue;
  }
  getServerQueue(){
    return this.serverQueue;
  }
}

// 생성
const restaurant = new Restaurant();

// 유저 입력받기
getUserInput(restaurant);

// 1초마다 주문 상태 출력
const increase = staticTimeCounter()
setInterval( () => {
  console.log(`** ${increase()} 초 경과 **`);

  restaurant.printAllQueues();

  console.log();
}, 1000);


// emitter 리스너
emitter.on("newOrder", () => {
  restaurant.advanceChefQueue();
});

emitter.on("cookDone", () => {
  restaurant.advanceChefQueue();
  restaurant.advanceServerQueue();
});

emitter.on("serveDone", () => {
  if(restaurant.serverQueue.length > 0){
    restaurant.advanceServerQueue();
  }
  else if (restaurant.chefQueue.length === 0 && restaurant.serverQueue.length === 0){
    restaurant.printAllQueues();
    console.log("오늘 샷다 내려!");
    process.exit();
  }
});