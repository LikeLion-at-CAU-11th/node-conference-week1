const EventEmitter = require("events");

emitter = new EventEmitter();
// 동일 인스턴스가 호출한 이벤트만 listen 할 수 있으므로, 공통 인스턴스를 선언 후 export한다



module.exports.emitter = emitter;