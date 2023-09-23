const readline = require("readline");
const EventEmitter = require("events");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const emitter = new EventEmitter();

const foodList = [];

function calTime (what, size) {
  let time = 0;
  if(size==='소형')time = 1000;
  else if(size==='중형')time=2000;
  else if(size === '대형')time=3000;
  return time;
}

let cookingIdx = -1;
let servingIdx = -1;

const cook = (what, size) => {
  const time = calTime(what, size);
  console.log(`사이즈 : ${size}, 시간 : ${time}`);
  console.log(`size는${size}`);
  let seconds = 0;
  const interval = setInterval(()=>{
    seconds++;
    console.log(`${seconds}초`);
    console.log(`${what} (${size}) 요리중`);
  }, 1000);
  setTimeout(()=>{
    clearInterval(interval);
    serve(what, size);
  }, time+1000);
}
const serve = (what, size) => {
  const time = calTime(what, size);
  let seconds = parseInt(time) / 1000;
  const interval = setInterval(()=>{
    seconds++;
    console.log(`${seconds}초`);
    console.log(`${what} (${size}) 서빙중`);
  }, 1000);
  setTimeout(()=>{
    clearInterval(interval);
    console.log('over');
  }, time+1000);
}

rl.question("원하는 음식을 입력하시오(예 - '스파게티, 3:1') : ", (line)=>{
  const [foodName, foodInfo] = line.split(',').map(part => part.trim());
  const [what, num] = foodInfo.split(':');
  for(let i=0;i<num;i++){
    foodList.push([foodName, what]);
  }
  console.log(foodList);
  emitter.emit('cooking', foodList.shift());
})

rl.on('line', (line)=>{
  console.log("원하는 음식을 입력하시오(예 - '스파게티, 3:1')");

  const [foodName, foodInfo] = line.split(',').map(part => part.trim());
  const [what, num] = foodInfo.split(':');

  for(let i=0;i<num;i++){
    foodList.push({foodName:what});
    console.log(foodName, what);
  }
  // process.exit();
});

emitter.on('cooking', (food)=>{
  let size = '';
  console.log(food);
  // const [what, num] = food.split(':');
  const what = food[0];
  const num = food[1];
  if(num === '1'){
    size = '소형';
  }
  else if(num === '2'){
    size = '중형';
  }
  else if(num === '3'){
    size = '대형';
  }
  console.log(`cooking : ${size}`);
  cook(what, size);
})






// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

// process.stdin.on('keypress', (str, key)=>{
//   if(key.ctrl && key.name==='i'){
//     console.log('hi');
//   }
// })



