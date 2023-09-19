const { Status } = require("./Status");

class Order {
  constructor(inputString) {
    this.menu = inputString.trim().split(",")[0];
    this.size = parseInt(inputString.trim().split(",")[1].split(":")[0]);
    this.menuStatus = Status.WAITING;
  }
  sizeToString() {
    const sizeMap = {
      1: "소형",
      2: "중형",
      3: "대형",
    };
    return sizeMap[this.size];
  }
  menuStatusToString() {
    const statusMap = {
      [Status.WAITING]: "요리대기",
      [Status.COOKING]: "요리중",
      [Status.COOKED]: "요리완료/서빙대기",
      [Status.SERVING]: "서빙중",
      [Status.SERVED]: "서빙완료!",
    };
    return statusMap[this.menuStatus];
  }
  getSize() {
    return this.size;
  }
  printStatus() {
    console.log(`${this.menu} (${this.sizeToString()}): ${this.menuStatusToString()}`);
  }
}

module.exports.Order = Order;
