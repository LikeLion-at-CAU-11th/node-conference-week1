const readline = require("readline");
const EventEmitter = require("events");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const eventEmitter = new EventEmitter();

const sizeDic = {
  1: "소형",
  2: "중형",
  3: "대형",
};

let timer = 0; // 총 경과시간

const timerIdList = []; // clear 할 timerId
const inputQueue = []; // 주문 대기열
const cookQueue = []; // 요리 대기열
const serveQueue = []; // 서빙 대기열

// 콘솔 입력 받기
rl.question("먹고 싶은 음식을 입력해주세요. ex) 스파게티, 3:1\n", (line) => {
  const result = line.split(",");
  const food = result[0].trim();
  const [size, count] = result[1].trim().split(":");
  for (let i = 0; i < count; i++) {
    inputQueue.push([food, size, count]);
  }
  eventEmitter.emit("cook start");
});

// 콘솔 여러줄 입력 받기
rl.on("line", (line) => {
  const result = line.split(",");
  const food = result[0].trim();
  const [size, count] = result[1].trim().split(":");
  for (let i = 0; i < count; i++) {
    inputQueue.push([food, size, count]);
  }
  eventEmitter.emit("cook start");
});

function makeFood() {
  const data = inputQueue.shift();
  cookQueue.push(data);
  eventEmitter.emit("cook", data);
}

// 서빙하기
function serveFood() {
  const data = cookQueue.shift();
  serveQueue.push(data);
  eventEmitter.emit("cook", data);
}

eventEmitter.on("printInput", () => {
  inputQueue.forEach((data) => {
    console.log(`${data[0]} (${sizeDic[data[1]]}) 요리대기`);
  });
});

eventEmitter.on("printCook", () => {
  cookQueue.forEach((data) => {
    console.log(`${data[0]} (${sizeDic[data[1]]}) 요리중`);
  });
});

eventEmitter.on("printServe", () => {
  serveQueue.forEach((data) => {
    console.log(`${data[0]} (${sizeDic[data[1]]}) 서빙중`);
  });
});

eventEmitter.on("printServeEnd", () => {
  console.log(`${serveQueue[0][0]} (${sizeDic[serveQueue[0][1]]}) 서빙 완료!`);
  serveQueue.shift();
});

eventEmitter.on("cook", (data) => {
  const [food, size, count] = data;
  const timerId = setInterval(() => {
    timer += 1;
    console.log(`${timer}초 경과,,`);
    eventEmitter.emit("printServe");
    eventEmitter.emit("printCook");
    eventEmitter.emit("printInput");
  }, 1000);
  timerIdList.push(timerId);
  setTimeout(() => {
    if (serveQueue.length > 0) {
      eventEmitter.emit("printServeEnd");
    }
    if (inputQueue.length > 0) {
      eventEmitter.emit("cook start");
    }
    if (cookQueue.length > 0) {
      eventEmitter.emit("serve start");
    }

    clearInterval(timerIdList.shift());
    if (inputQueue.length == 0 && cookQueue.length == 0 && serveQueue.length == 0)
      eventEmitter.emit("close");
  }, size * 1050);
});

eventEmitter.on("check", () => {
  if (inputQueue.length > 0) eventEmitter.emit("cook start");
});

eventEmitter.on("serve", (data) => {
  const [food, size, count] = data;
  const timerId = setInterval(() => {
    timer += 1;
    console.log(`${timer}초 경과,,`);
    eventEmitter.emit("printServe");
    eventEmitter.emit("printCook");
    eventEmitter.emit("printInput");
  }, 1000);
  timerIdList.push(timerId);
  setTimeout(() => {
    eventEmitter.emit("printServeEnd");
    clearInterval(timerIdList.shift());
    if (inputQueue.length == 0 && cookQueue.length == 0 && serveQueue.length == 0)
      eventEmitter.emit("close");
  }, size * 1050);
});

// 요리 시작
eventEmitter.on("cook start", makeFood);

// 서빙 시작
eventEmitter.on("serve start", serveFood);

eventEmitter.on("close", () => {
  process.exit();
});
