const fs = require("fs");
const zlib = require("zlib");

const readStream = fs.createReadStream("./readme-buffer.txt", {
  highWaterMark: 16,
});
// 압축 스트림
const zlibStream = zlib.createGzip();

// 압축된 걸 저장한다
const writeStream = fs.createWriteStream("./write-buffer.txt.gz");
readStream.pipe(zlibStream).pipe(writeStream);
