var menu, size, num;
var menuArr = [];
var currentMenuStatus = [];
var sec = 1;
var time = 0;


const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.on("line", (line) => {
    // input = line.split(',').map(el => el);
    menu = line.split(',')[0]
    size = parseInt((line.split(',')[1]).split(':')[0]);
    num = parseInt((line.split(',')[1]).split(':')[1]);
    for(var i = 0; i < num; i++){
        currentMenuStatus.push('요리대기');
        if (size === 3){
            menuArr.push(`${menu}(대형)`);
        } else if (size === 2) {
            menuArr.push(`${menu}(중형)`);
        } else {
            menuArr.push(`${menu}(소형)`);
        }
    }
    rl.close();
});

var EventEmitter = require('events');
const getDishes = new EventEmitter();
const timer = new EventEmitter();
    
timer.on('tick', () => {
    if (time === 0){
        for (var index=0; index<num; index++){
            getDishes.emit('make_menus', index);
        }
        time += 1;
    } else {
        console.log(`${time}초 경과,`);
        for (var menu = 0; menu < num; menu++){
            console.log(`${menuArr[menu]} ${currentMenuStatus[menu]}`);
        }
        time += 1;
    }
});

getDishes.on('make_menus', (index)=>{
    if (index===0){
        currentMenuStatus[index] = '요리중';
        setTimeout(()=>{
            currentMenuStatus[index] = '서빙중';
        }, size*1000);
        setTimeout(()=>{
            currentMenuStatus[index]= '서빙완료!';
        }, (size*1000 + size*1000));
    } else {
        setTimeout(()=>{
            currentMenuStatus[index] = '요리중';
        }, size*index*1000);
        setTimeout(()=>{
            currentMenuStatus[index] = '서빙중';
        }, (size*index*1000 + size*1000));
        setTimeout(()=>{
            currentMenuStatus[index]= '서빙완료!';
        }, (size*index*1000 + size*1000 + size*1000));
    }
})

rl.on('close', () => {
    setInterval(function(){
        if (currentMenuStatus[num-1] === '서빙완료!'){
            console.log('오늘 샷따 내려!');
            process.exit();
        } else {
            timer.emit('tick');
        }
    }, sec*1000);
})