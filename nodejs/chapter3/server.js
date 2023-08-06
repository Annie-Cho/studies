const http = require("http");

// 요청이 오면 이 함수가 실행된다.
// 비동기 작업이기 때문에 항상 에러처리 필요!
const server = http
  .createServer((req, res) => {
    // 응답 승인, 거부 가능
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello Server!</p>");
    res.end("<p>Hello Annie</p>");
  })
  .listen(8080, () => {
    console.log("8080번 포트에서 서버 대기 중입니다.");
  }); //서버를 프로세스로 올려줘야한다(8080번 포트에 올려준다)

server.on("listening", (error) => {
  console.error(error);
});
server.on("error", () => {
  console.error(error);
});

// listen의 callback을 분리할 수도 있다
server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기 중입니다.");
});

// 코드를 수정하면 서버를 껐다가 켜야지만 수정본이 반영된다.
