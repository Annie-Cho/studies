const EventEmitter = require("events");

const myEvent = new EventEmitter();

myEvent.addListener("event1", () => {
  console.log("event1");
});
myEvent.on("event2", () => {
  console.log("event2");
});
myEvent.on("event2", () => {
  console.log("event2 added");
});

// 한 번만 실행되는 이벤트
myEvent.once("event3", () => {
  console.log("event3");
});

myEvent.emit("event1");
myEvent.emit("event2");
myEvent.emit("event3");
// event3은 한 번만 실행되는 이벤트 이므로 실행 안됌
myEvent.emit("event3");

// 연결된 모든 이벤트 삭제
myEvent.on("event4", () => {
  console.log("event4");
});
myEvent.removeAllListeners("event4");

const listener = () => {
  console.log("event5");
};

myEvent.on("event5", listener);

// 한 개의 이벤트만 삭제
myEvent.removeListener("event5", listener);

// 연결된 이벤트 개수
console.log(myEvent.listenerCount("event2"));
