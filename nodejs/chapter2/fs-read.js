const fs = require("fs").promises;

fs.readFile("./readme.txt")
  .then((data) => {
    console.log(data); // 16진수 데이터
    console.log(data.toString()); // 사람이 읽을 수 있는 데이터
  })
  .catch((err) => {
    throw err;
  });
