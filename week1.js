const readline = require("readline");
const EventEmitter = require("events");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const emitter = new EventEmitter();

const foodList = [];

// function calTime (what, size) {
//   let time = 0;
//   if(size==='소형')time = 1000;
//   else if(size==='중형')time=2000;
//   else if(size === '대형')time=3000;
//   return time;
// }

let cookingIdx = 0;
let servingIdx = -1;

const processing = () => {
  let seconds = 0;
  let cookingTime = -1;
  let servingTime = 0;
  let servingAmounts = 0;
  const size = foodList.length;
  const interval = setInterval(()=>{
    seconds++;
    cookingTime++;
    
    console.log(`${seconds}초`);

    if(servingAmounts > 0){
      servingTime++;
    }
    if(servingIdx>=0){
      if(servingAmounts > 0 && servingTime == foodList[servingIdx][1]){
        servingAmounts--;
        servingTime = 0;
      }
    }

    for(let i = 0; i<size;i++){

      if(cookingTime==foodList[i][1]){ // 요리 다 되면
        cookingTime = 0;
        servingAmounts++;
        if(servingAmounts == 1)
          servingIdx++;
        cookingIdx++;
      }      
      const what = foodList[i][0];
      const size = makeFoodSize(foodList[i]);
      if(i == cookingIdx){
        console.log(`${what} (${size}) 요리중`);
      }
      else if(i == servingIdx){
        console.log(`${what} (${size}) 서빙중`);
      }
      else if(i<servingIdx){
        console.log(`${what} (${size}) 끝`);
      }
      else if(i > servingIdx){
        console.log(`${what} (${size}) 대기중`);
      }
      
    }
    if(servingIdx == size){
      finish(interval);
    }
  }, 1000);
}

function makeFoodSize (food) {
  const what = food[0];
  const num = food[1];
  if(num === '1'){
    return size = '소형';
  }
  else if(num === '2'){
    return size = '중형';
  }
  else if(num === '3'){
    return size = '대형';
  }
}

const finish = (interval) => {
  clearInterval(interval);
  console.log('오늘 샷다 내려!');
}

rl.question("원하는 음식을 입력하시오(예 - '스파게티, 3:1') : ", (line)=>{
  const [foodName, foodInfo] = line.split(',').map(part => part.trim());
  const [what, num] = foodInfo.split(':');
  for(let i=0;i<num;i++){
    foodList.push([foodName, what]);
  }
  // console.log(foodList); // 음식 리스트 출력
  emitter.emit('cooking', );
})

rl.on('line', (line)=>{
  console.log("원하는 음식을 입력하시오(예 - '스파게티, 3:1')");

  const [foodName, foodInfo] = line.split(',').map(part => part.trim());
  const [what, num] = foodInfo.split(':');
  for(let i=0;i<num;i++){ 
    foodList.push({foodName:what});
    console.log(foodName, what);
  }
});

emitter.on('cooking', ()=>{ 
  processing();
})






// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

// process.stdin.on('keypress', (str, key)=>{
//   if(key.ctrl && key.name==='i'){
//     console.log('hi');
//   }
// })



