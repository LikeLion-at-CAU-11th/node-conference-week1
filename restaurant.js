const EventEmitter = require('events');
const readline = require('readline');

class Order extends EventEmitter {
    constructor(name, size, count) {
        super();
        this.name = name;
        this.size = size;
        this.count = count;
        this.status = "요리대기";
    }

    cook() {
        this.status = "요리중";
        setTimeout(() => {
            this.serve();
        }, this.size * 1000);
    }

    serve() {
        this.status = "서빙중";
        setTimeout(() => {
            this.status = "서빙완료";
            this.emit('served');
        }, this.size * 1000);
    }
}

class Kitchen extends EventEmitter {
    constructor() {
        super();
        this.orders = [];
    }

    order(name, size, count) {
        for (let i = 0; i < count; i++) {
            const order = new Order(name, size, count);
            order.on('served', () => {
                const nextOrder = this.orders.find(order => order.status === "요리대기");
                if (nextOrder) nextOrder.cook();
                else if (this.orders.every(order => order.status === "서빙완료")) {
                    console.log(`${process.uptime().toFixed()}초 경과`);
                    this.orders.forEach(order => console.log(`${order.name}(${order.size}) ${order.status}`));
                    console.log("오늘 샷다 내려!");
                    process.exit(0);
                }
            });
            this.orders.push(order);
            if (i === 0) order.cook();
        }
    }

    status() {
        setInterval(() => {
            console.log(`${process.uptime().toFixed()}초 경과`);
            this.orders.forEach(order => console.log(`${order.name}(${order.size}) ${order.status}`));
        }, 1000);
    }
}

const kitchen = new Kitchen();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('입력 : ', (input) => {
  const [name, sizeCount] = input.split(', ');
  const [size, count] = sizeCount.split(':').map(Number);
  kitchen.order(name, size, count);
  kitchen.status();
  rl.close();
});