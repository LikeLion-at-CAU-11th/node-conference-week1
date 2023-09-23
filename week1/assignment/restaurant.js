const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const readline = require("readline");

class Restaurant {
  constructor() {
    this.orderQueue = [];
    this.cookingQueue = [];
    this.servingQueue = [];
    this.time = 1;
  }

  async order(food, size, quantity) {
    for (let i = 0; i < quantity; i++) {
      await this.orderQueue.push({ food, size });
    }

    if (this.cookingQueue.length === 0) {
      this.cookFood();
    }
  }

  cookFood() {
    this.cookingQueue.push(this.orderQueue.shift());

    const { food, size } = { ...this.cookingQueue[0] };

    let cookingTime;
    switch (size) {
      case 3:
        cookingTime = 3000;
        break;
      case 2:
        cookingTime = 2000;
        break;
      case 1:
        cookingTime = 1000;
        break;
      default:
        console.log("\n사이즈를 잘못 입력했습니다");
        return;
    }

    let printStatus = setInterval(() => {
      console.log(
        `${this.time++}초 경과 - ${food} ${sizeNumberToSize(size)} 요리중`
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(printStatus);
      console.log(`${food} (${sizeNumberToSize(size)}) 요리완료!`);
      eventEmitter.emit("cooked");
    }, cookingTime);
  }

  serveFood() {
    this.servingQueue.push(this.cookingQueue.shift());

    const { food, size } = { ...this.servingQueue[0] };

    let servingTime;
    switch (size) {
      case 3:
        servingTime = 3000;
        break;
      case 2:
        servingTime = 2000;
        break;
      case 1:
        servingTime = 1000;
        break;
      default:
        return;
    }

    let printStatus = setInterval(() => {
      console.log(
        `${this.time++}초 경과 - ${food} ${sizeNumberToSize(size)} 서빙중`
      );
    }, 1000);

    setTimeout(() => {
      clearInterval(printStatus);
      console.log(`${food} (${sizeNumberToSize(size)}) 서빙완료!`);
      if (this.orderQueue.length === 0) {
        console.log("오늘 샷다 내려!");
      } else {
        eventEmitter.emit("served");
      }
    }, servingTime);
  }
}

sizeNumberToSize = (sizeNumber) => {
  if (sizeNumber == "1") {
    return "소자";
  } else if (sizeNumber == "2") {
    return "중자";
  } else {
    return "대자";
  }
};

const restaurant = new Restaurant();

eventEmitter.on("cooked", () => restaurant.serveFood());
eventEmitter.on("served", () => restaurant.cookFood());
eventEmitter.on("shutterDown", () => {
  if (this.orderQueue.length === 0) {
    console.log("오늘 샷다 내려!");
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let count = 1;

const getOrder = () => {
  rl.question(
    "\n주문을 형식에 맞게 입력해주세요(요리, 사이즈:수량) : ",
    (order) => {
      const [foodAndSize, quantity] = order.split(":");
      const [food, size] = foodAndSize.split(",");

      restaurant.order(
        food.trim(),
        parseInt(size.trim()),
        parseInt(quantity.trim())
      );
      count++;
      if (count === 6) {
        console.log("\n재료 소진입니다 다음에 이용해주세요");
        rl.close();
      }
      getOrder();
    }
  );
};

getOrder();
