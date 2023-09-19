const EventEmitter = require("events");
const emitter = new EventEmitter();

const Status = {
  WAITING: 0,
  COOKING: 1,
  COOKED: 2,
  SERVING: 3,
  SERVED: 4,
};

class Order {
  constructor(orderInfo) {
    // "스파게티, 3"
    [this.dish, this.size] = orderInfo.split(/[,:]/).map((item) => item.trim());
    this.size = parseInt(this.size);
    this.status = Status.WAITING;
  }

  getOrderSize() {
    return this.size;
  }

  getOrderStatus() {
    const statusStrings = {
      [Status.WAITING]: "요리대기",
      [Status.COOKING]: "요리중",
      [Status.COOKED]: "서빙대기",
      [Status.SERVING]: "서빙중",
      [Status.SERVED]: "서빙완료",
    };

    return statusStrings[this.status] || "알 수 없음";
  }
  getSizeString() {
    const sizeStrings = {
      1: "소형",
      2: "중형",
      3: "대형",
    };
    return sizeStrings[this.size];
  }

  printStatus(){
    console.log(`${this.dish} (${this.getSizeString()}): ${this.getOrderStatus()}`);
  }
}

class Chef {
  constructor() {
    this.chefQueue = []; // 요리사가 해야할 요리 리스트
    this.isCooking = false; // 현재 요리 상황
  }
  startCook() {
    if (this.chefQueue.length > 0 && !this.isCooking) {
      this.isCooking = true;
      const currentOrder = this.chefQueue[0];
      currentOrder.status = Status.COOKING;

      setTimeout(() => {
        // 요리시간
        currentOrder.status = Status.COOKED;
        emitter.emit("cookDone", currentOrder);
        this.chefQueue.shift();
        this.isCooking = false;
        this.startCook();
        // 모든 주문을 처리할 때까지 재귀 호출
      }, currentOrder.getOrderSize() * 1000);
    }
  }
}

class Server {
  constructor() {
    this.serverQueue = []; // 서빙해야할 요리 리스트
    this.isServing = false; // 현재 서빙 상황
  }
  startServing() {
    if (this.serverQueue.length > 0 && !this.isServing) {
      this.isServing = true;
      const currentOrder = this.serverQueue[0];
      currentOrder.status = Status.SERVING;

      setTimeout(() => {
        currentOrder.status = Status.SERVED;
        this.serverQueue.shift();
        this.isServing = false;
        emitter.emit("serveDone");
        this.startServing();
      }, currentOrder.getOrderSize() * 1000);
    }
  }
}

// 레스토랑 객체
class Restaurant {
  constructor() {
    this.orders = [];
    this.chef = new Chef();
    this.server = new Server();
  }

  // 주문 받기
  addOrder(newOrder) {
    console.log(`사장님 <${newOrder}> 주문이요~!`);
    const [orderInfo, count] = newOrder.split(/[:]/).map((item) => item.trim());
    // 메뉴 개수만큼 Order객체 생성
    for (let i = 0; i < count; i++) {
      const order = new Order(orderInfo);
      // 셰프 주문목록 추가
      this.orders.push(order)
      this.chef.chefQueue.push(order);
    }
    emitter.emit("newOrder");
  }
}

// 이미터 위치 중요
emitter.on("newOrder", () => {
  멋사레스토랑.chef.startCook();
});

emitter.on("cookDone", (currentOrder) => {
  멋사레스토랑.server.serverQueue.push(currentOrder);
  멋사레스토랑.server.startServing();
});

emitter.on("serveDone", () => {
  if (
    멋사레스토랑.chef.chefQueue.length === 0 &&
    멋사레스토랑.server.serverQueue.length === 0
  ) {
    console.log("오늘 샷다 내려!");
    process.exit();
  }
});

let secondsElapsed = 1;

const intervalId = setInterval(() => {
  console.log(`⏰ ${secondsElapsed}초 경과`);
  secondsElapsed++;

  // 모든 주문에 대해서 상태 메시지를 출력
  멋사레스토랑.orders.forEach((order) => {
    order.printStatus();
  });

  // 모든 요리가 완료되면 clearInterval로 인터벌 중지
  if (
    멋사레스토랑.chef.chefQueue.length === 0 &&
    멋사레스토랑.server.serverQueue.length === 0
  ) {
    console.log("오늘 샷다 내려!");
    clearInterval(intervalId);
  }
}, 1000);


const 멋사레스토랑 = new Restaurant();

멋사레스토랑.addOrder("스파게티, 2:2");
멋사레스토랑.addOrder("짬뽕, 3:1");
