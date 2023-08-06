const fs = require("fs");

/* 비동기 코드
fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("1번", data.toString()); // 사람이 읽을 수 있는 데이터
});

fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("2번", data.toString()); // 사람이 읽을 수 있는 데이터
});

fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("3번", data.toString()); // 사람이 읽을 수 있는 데이터
});

fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("4번", data.toString()); // 사람이 읽을 수 있는 데이터
});
*/

// 동기 코드
let data = fs.readFileSync("./readme.txt");
console.log("1번", data.toString());
data = fs.readFileSync("./readme.txt");
console.log("2번", data.toString());
data = fs.readFileSync("./readme.txt");
console.log("3번", data.toString());
data = fs.readFileSync("./readme.txt");
console.log("4번", data.toString());
