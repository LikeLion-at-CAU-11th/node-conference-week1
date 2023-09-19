const readline = require("readline");
const events = require("events");

class Restaurant extends events.EventEmitter {
  constructor() {
    super();
    this.orderQueue = [];
    this.cookingQueue = [];
    this.servingQueue = [];

    // setInterval(() => this.status(), 1000);
  }

  order(food, size, quantity) {
    for (let i = 0; i < quantity; i++) {
      this.orderQueue.push({ food, size });
    }

    if (this.cookingQueue.length === 0) {
      this.nextFood();
    }
  }

  nextFood() {
    if (
      this.orderQueue.length === 0 &&
      this.cookingQueue.length === 0 &&
      this.servingQueue === 0
    ) {
      console.log("\n오늘 샷다 내려!");
      process.exit(0);
    }
    if (this.orderQueue.length > 0) {
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
          console.log("\n사이즈가 맞지 않습니다");
          return;
      }

      console.log(`\n${food} ${sizeNumberToSize(size)} 요리중`);
      setTimeout(() => {
        console.log(`\n${food} (${sizeNumberToSize(size)}) 요리완료!`);
        this.cookingQueue.shift();
        this.emit("cooked", food, size);
      }, cookingTime);
    } else if (this.servingQueue.length == 0 && this.cookingQueue.length > 0) {
      const { food, size } = { ...this.cookingQueue[0] };
      this.cookingQueue.shift();
      this.emit("cooked", food, size);
    }
    // else {
    //   const { food, size } = { ...this.servingQueue[queue] };
    //   restaurant.emit("served");
    // }
    // setTimeout(() => {
    //   if (this.orderQueue.length > 0) {
    //     this.nextFood();
    //   }
    // }, 1000);
  }

  serve(food, size) {
    console.log(`\n${food} ${sizeNumberToSize(size)} 서빙중`);
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
        console.log("\n불가능한 시간");
        return;
    }
    setTimeout(() => {
      console.log(`\n${food} ${sizeNumberToSize(size)} 서빙완료!`);
      this.servingQueue.shift();
      this.emit("served");

      if (this.cookingQueue.length > 0) {
        const { food, size } = { ...this.cookingQueue[0] };
        this.emit("cooked", food, size);
      } else {
        this.nextFood();
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

restaurant.on("cooked", (food, size) => restaurant.serve(food, size));
restaurant.on("served", () => restaurant.nextFood());

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
        console.log("\n재료 소진입니다");
        rl.close();
      }
      getOrder();
    }
  );
};

getOrder();
