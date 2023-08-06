// buffer로 파일을 읽으려면 fs.readFile()활용

const fs = require("fs");
const readStream = fs.createReadStream("./readme-buffer.txt", {
  highWaterMark: 16,
});

const data = [];
readStream.on("data", (chunk) => {
  data.push(chunk);

  console.log("data : ", chunk, chunk.length);
});
readStream.on("end", () => {
  console.log("end : ", Buffer.concat(data).toString());
});
readStream.on("error", () => {
  console.log("error : ", err);
});
