const EventEmitter = require('events');
const readline = require("readline");

const eventEmitter = new EventEmitter();
const STATUS = Object.freeze([
  "요리 대기",
  "요리 중",
  "서빙 중",
  "서빙 완료!",
]);
const SIZE = Object.freeze([
  "X",
  "소",
  "중",
  "대",
]);
let cookIdx = 0, serveIdx = -1, time = 1, count = 0, loop;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

eventEmitter.on('start', () => {
  rl.question('Kiosk | ', (input) => {
    const [food, size, num] = input.split(/[:,,]/).map(each => each.trim());
    console.log(food + " " + SIZE[size] + "사이즈 " + num +"개 주문 받았습니다 !");
    console.log();
    const foodStatusArr = Array.from({length: num}, () => 0);
    eventEmitter.emit('startLoop', { food, size, num, foodStatusArr });
  });
});

eventEmitter.on('startLoop', ({ food, size, num, foodStatusArr }) => {
  loop = setInterval(function() {
    console.log(time++ + "초 경과");
    eventEmitter.emit('count', { size, num, foodStatusArr });
    eventEmitter.emit('print', { food, size, foodStatusArr });
    eventEmitter.emit('check',  { size, num, foodStatusArr })

    console.log();
  }, 1000);
});

eventEmitter.on('count', ({size, num, foodStatusArr}) => { 
  if(count % size == 0){
    if(cookIdx < num)
      foodStatusArr[cookIdx]++;
    foodStatusArr[serveIdx]++;
  }
});

eventEmitter.on('print', ({food, size, foodStatusArr}) => {
  foodStatusArr.forEach(no => {
    console.log(food + " (" + SIZE[size] + ")  |  " + STATUS[no]);
  });
});

eventEmitter.on('check', ({size, num, foodStatusArr}) => { 
  if(++count % size == 0){
    cookIdx++;
    foodStatusArr[serveIdx++]++;
    count = 0;
  }

  if(serveIdx == num)
    eventEmitter.emit('close');
});

eventEmitter.on('close', () => {
  clearInterval(loop);
  console.log("\n오늘 샷다 내려! ψ(｀∇´)ψ ");
  process.exit();
});


eventEmitter.emit('start');