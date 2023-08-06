const url = require("url");

const { URL } = url;
// 객체 생성
const newUrl = new URL(
  "http://www.gilbut.co.kr/book/booklist.aspx?sercate1=001001000#anchor"
);

console.log("new URL() : ", newUrl);
// 객체를 다시 문자열로 변경
console.log("url.format() : ", url.format(newUrl));

newUrl.searchParams.append("filter", "es3");
newUrl.searchParams.append("filter", "es5");

console.log(newUrl.searchParams.getAll("filter"));
