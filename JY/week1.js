const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = {
  3: "大",
  2: "中",
  1: "小",
};

const STATE = ["요리대기", "요리중", "서빙중", "서빙완료"];

let food = "";
let size = "";
let num = 0;
let currentIndex = 0;
let foodNum = [];

eventEmitter.on("order", () => {
  rl.question(`🍴 주문 입력 🍴: `, (input) => {
    const [a, b] = input.split(", ").map((_) => _.trim());
    const [c, d] = b.split(":");
    food = a;
    size = parseInt(c);
    num = parseInt(d);
    foodNum = Array.from({ length: num }, (_, index) => index);
    eventEmitter.emit("start");
  });
});

eventEmitter.on("start", () => {
  const time = size * num;
  let t = 0;
  const interval = setInterval(() => {
    console.log(`${++t}초 경과`);
    eventEmitter.emit("print");

    if (size === 3) {
      if (t % 3 === 0) {
        currentIndex = (currentIndex + 1) % STATE.length;
      }
    } else if (size === 2) {
      if (t % 2 === 0) {
        currentIndex = (currentIndex + 1) % STATE.length;
      }
    } else if (size === 1) {
      if (t % 1 === 0) {
        currentIndex = (currentIndex + 1) % STATE.length;
      }
    }

    if (t - 1 === time) {
      clearInterval(interval);
      eventEmitter.emit("end");
    }
  }, 1000);
});

eventEmitter.on("print", () => {
  foodNum.forEach((a) => {
    if (a === 0) {
      console.log(`${food} (${menu[size]}) ${STATE[currentIndex + 1]}`);
    } else {
      console.log(`${food} (${menu[size]}) ${STATE[currentIndex]}`);
    }
  });
});

eventEmitter.on("end", () => {
  console.log("\n모든 음식 서빙 완료");
  console.log("영업 종료");
  process.exit();
});

eventEmitter.emit("order");
