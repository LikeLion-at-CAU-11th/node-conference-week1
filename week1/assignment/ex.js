const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

const readline = require("readline"); //콘솔에 입력 받기위해
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const getOrder = () => {
//   let count = 0;
//   rl.question("음식 주문 받습니다!", (order) => {
//     const [food, sizeAndNumber] = order.split(", ");
//     const [size, number] = sizeAndNumber.split(":");
//     console.log(
//       `${food} ${sizeNumberToSize(size)} ${number}개 주문 받았습니다!`
//     );
//     count += 1;
//     if (count === 6) {
//       console.log("오늘 재료 소진으로 주문 마감입니다!");
//       rl.close();
//     }
//   });
// };

const Restaurant = () => {
  const timeTakingBySize = {
    소자: 1000,
    중자: 2000,
    대자: 3000,
  };

  const status = Object.freeze({
    ready: "요리 대기",
    cooking: "요리 중",
    serving: "서빙중",
    complete: "서빙완료!",
  });

  this.cookTime = timeTakingBySize;
  this.serveTime = timeTakingBySize;
  this.orderQueue = [];
  this.cookingQueue = [];
  this.servingQueue = [];
  this.currentOrderIndex = -1;
  this.currentCookIndex = -1;

  function sizeNumberToSize(sizeNumber) {
    if ((sizeNumber = 1)) {
      return "소자";
    } else if ((sizeNumber = 2)) {
      return "중자";
    } else {
      return "대자";
    }
  }

  function sizeToSizeNumber(size) {
    if ((size = "소자")) {
      return 1;
    } else if ((size = "중자")) {
      return 2;
    } else {
      return 3;
    }
  }

  function getInput() {
    let count = 0;
    rl.question("음식 주문 받습니다!", (order) => {
      const [food, sizeAndNumber] = order.split(", ");
      const [size, number] = sizeAndNumber.split(":");
      console.log(
        `${food} ${sizeNumberToSize(size)} ${number}개 주문 받았습니다!`
      );
      count += 1;
      if (count === 6) {
        console.log("오늘 재료 소진으로 주문 마감입니다!");
        rl.close();
      }
    });
  }

  function getOrder(order) {
    const [food, sizeAndNumber] = order.split(", ");
    const [size, number] = sizeAndNumber.split(":");
    console.log(
      `${food} ${sizeNumberToSize(size)} ${number}개 주문 받았습니다!`
    );

    for (let i = 0; i < number; i++) {
      this.orderQueue.push({ food: food.trim(), size: size.trim() });
      if (this.currentCookIndex === -1) {
        // 주문이 처음 들어왔을 때 요리 시작
        this.startCooking();
      }

      if (this.currentOrderIndex === -1) {
        // 서빙이 아무것도 진행 중이지 않을 때 서빙 시작
        this.startServing();
      }
    }

    return Promise.resolve(); // 주문 처리 완료를 알리기 위해 Promise 반환
  }

  function cookFood(index) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${this.cookingQueue[index]} `);
      });
    });
  }

  async function startCooking() {
    while (this.currentCookIndex < this.cookingQueue.length - 1) {
      const nextDishToCookIdx = ++currentCooKindex;
      await cookDish(nextDishToCookIdx);
      console.log(
        `${this.cookingQeueu[nextDishToServeIdx]}(${nextDish.size}) 완료!`
      );
      await startServing();
    }
  }
  async function startServing() {
    while (this.orderQeueu.length !== 0) {
      const currentServeItem = this.orderQeueu.shift();
      await cook(currentServeItem);
      servedQue.push(currentServeItem);
      console.log(`${currentServeItem.name}(${currentServeItem.size})요리대기`);
    }
  }
};

const restaurant = new Restaurant();

restaurant
  .getOrder("스파게티 ,대형 :2")
  .then(() => {
    console.log("오늘 샷다 내려!");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

time = 1;
printTime = setInterval(() => {
  console.log(`${time}초 경과,`);
  console.log();
  console.log();
  time += 1;
}, 1000);

const restaurant = new Restaurant();

function getInput(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function runProgram() {
  while (true) {
    try {
      const order = await getInput("주문을 입력하세요 : ");
      if (order === "exit") {
        console.log("프로그램 종료");
        process.exit(0);
      }
      await restaurant.placeOrder(order);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

runProgram();
