const buffer = Buffer.from("저를 버퍼로 바꿔보세yo");

console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

// Buffer 합치기
const array = [
  Buffer.from("띄엄 "),
  Buffer.from("띄엄 "),
  Buffer.from("띄어쓰기 "),
];
console.log(Buffer.concat(array).toString());

// 5Byte짜리 Buffer 생성
console.log(Buffer.alloc(5));
