const readline = require("readline");
const events = require("events");

class Restaurant extends events.EventEmitter {
  constructor() {
    super();
    this.queue = [];
    this.cookingQueue = false;
    this.servingQueue = false;
  }

  order(food, size, quantity) {
    for (let i = 0; i < quantity; i++) {
      this.queue.push({ food, size });
    }

    if (!this.cooking) {
      this.nextFood();
    }
  }

  nextFood() {
    if (this.queue.length === 0) {
      console.log("오늘 샷다 내려!");
      process.exit(0);
    }

    const { food, size } = this.queue.shift();

    let time;

    switch (size) {
      case 3:
        time = 3000;
        break;
      case 2:
        time = 2000;
        break;
      case 1:
        time = 1000;
        break;
      default:
        console.log("사이즈가 맞지 않습니다");
    }

    function sizeNumberToSize(sizeNumber) {
      if ((sizeNumber = 1)) {
        return "소자";
      } else if ((sizeNumber = 2)) {
        return "중자";
      } else {
        return "대자";
      }
    }

    console.log(`${food} ${sizeNumberToSize(size)} 요리중`);
    setTimeout(() => {
      console.log(`${food} (${sizeNumberToSize(size)}) 요리완료!`);
      this.emit("cooked", food, size);
    }, time);

    setTimeout(() => {
      if (this.queue.length > 0) {
        this.nextFood();
      }
    }, 100);
  }

  serve(food, size) {
    console.log(`${food} ${sizeNumberToSize(size)} 서빙중`);

    setTimeout(() => {
      console.log(`${food} ${sizeNumberToSize(size)} 서빙완료!`);
    }, time);
  }
}

const restaurant = new Restaurant();

restaurant.on("cooked", (food, size) => restaurant.serve(food, size));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let count = 0;

const getOrder = () => {
  rl.question(
    "주문을 형식에 맞게 입력해주세요(요리, 사이즈:수량) : ",
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
        console.log("재료 소진입니다");
        rl.close();
      }
      getOrder();
    }
  );
};

getOrder();
