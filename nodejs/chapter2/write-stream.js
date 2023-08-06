const fs = require("fs");

const writeStream = fs.createWriteStream("./writeme2.txt");
// writeStream 이벤트 -> write, end, finish(이벤트 리스너)
writeStream.on("finish", () => {
  console.log("파일 쓰기 완료");
});

// write()한개가 하나의 버퍼
writeStream.write("이 글을 씁니다.\n");
writeStream.write("한 번 더 씁니다.");
writeStream.end();
