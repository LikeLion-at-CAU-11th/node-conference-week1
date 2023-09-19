const readline = require("readline");
const { emitter } = require("./emitter");
const { Restaurant } = require("./Restaurant");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInput(restaurant) {
  rl.question("", (input) => {
    console.log(`${input} 주문이요~~~`);
    restaurant.createOrder(input);
    process.nextTick(() => getUserInput(restaurant)); // 마이크로 태스크
  });
}

function staticTimeCounter(){ // 전역변수 사용X, 클로져 활용
  let count = 0;
  const counter = function () { count += 1; return count; }
  return counter;
}



// 생성
const restaurant = new Restaurant();
restaurant.hireChef();
restaurant.hireServer();

// 1초마다 주문 상태 출력
const increase = staticTimeCounter()
setInterval( () => {
  console.log(`** ${increase()} 초 경과 **`);
  restaurant.printAllQueues();
  console.log();
}, 1000);


// 유저 입력받기
getUserInput(restaurant);

// 리스너
emitter.on("newOrder", () => {
  restaurant.advanceChefQueue();
});

emitter.on("cookDone", () => {
  restaurant.advanceChefQueue();
  restaurant.advanceServerQueue();
});

emitter.on("serveDone", () => {
  if(restaurant.serverHasWorkToDo()){
    restaurant.advanceServerQueue();
  }
  else if (!restaurant.chefIsCooking() && !restaurant.serverIsServing()){
    restaurant.printAllQueues();
    console.log("오늘 샷다 내려!");
    process.exit();
  }
});