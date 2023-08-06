const http = require("http");
const fs = require("fs").promises;

// 서버 1
const server = http
  .createServer(async (req, res) => {
    // async/await 를 사용할 때에는 항상 에러처리 필요!
    try {
      res.writeHead(200, { "Content-Type": "text/html; charset=stf-8" }); // text/html -> html임을 알려준다
      const data = await fs.readFile("./server-html.html");
      res.end(data);
    } catch (e) {
      console.error(e);
      res.writeHead(200, { "Content-Type": "text/plain; charset=stf-8" }); //text/plain -> 일반 문자열임을 알려준다
      res.end(e.message); // 에러 메시지 전송
    }
  })
  .listen(8080);

server.on("listening", () => {
  // 추후에 배포 시에는 포트 번호를 80으로 변경하면 생략 가능하다
  console.log("8080번 포트에서 서버 대기 중입니다.");
});
server.on("error", () => {
  console.error(error);
});
