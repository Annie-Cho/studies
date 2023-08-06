const { odd, even } = require("./var"); // 구조 분해 할당
const checkNumber = require("./func"); // 원하는 변수로 가져오기 가능

function checkStringOddOrEven(str) {
  if (str.length % 2) {
    return odd;
  } else {
    return even;
  }
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven("hello"));
