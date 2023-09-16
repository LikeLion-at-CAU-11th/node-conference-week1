const EventEmitter = require('events');

const STATUS = ["요리 대기", "요리 중", "서빙 중", "서빙 완료 !"];
const SIZE = ["X", "소", "중", "대"];

let input = require('fs').readFileSync(__dirname+'/input.txt').toString().split(/[:,,]/);
let food = input[0].trim();
let size = parseInt(input[1].trim());
let num = parseInt(input[2].trim());
let cookIdx = 0, serveIdx = -1, time = 1, count = 0;
const arr = Array.from({length: num}, () => 0);

console.log(food + " " + SIZE[size] + "사이즈 " + num +"개 주문 받았습니다 !");
console.log();

const eventEmitter = new EventEmitter();

eventEmitter.on('print', () => {
  if(count % size == 0){
    arr[cookIdx]++;
    arr[serveIdx]++;
  }

  for(let i=0; i<num; i++){
    console.log(food + " (" + SIZE[size] + ")  |  " + STATUS[arr[i]]);
  }

  if(++count % size == 0){
    cookIdx++;
    arr[serveIdx++]++;
    count = 0;
  }

  if(serveIdx == num)
    eventEmitter.emit('close');
})

loop = setInterval(function() {
  console.log(time++ + "초 경과");
  eventEmitter.emit('print');

  console.log();
}, 1000);


eventEmitter.on('close', () => {
  clearInterval(loop);
  console.log();
  console.log("오늘 샷다 내려! ψ(｀∇´)ψ ");
});