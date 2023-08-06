const https = require("https");
const fs = require("fs");

https
  .createServer(
    // 서버 시작 전, 인증서를 인증기관에서 얻어오기
    // readFileSync() 써도 되는 경우 -> 딱 한번 실행하거나 서버를 초기화할 때 사용
    // 인증서를 적용하지 않고 서버를 실행할 경우 빨간색 자물쇠 표시가 뜬다
    {
      cert: fs.readFileSync("도메인 인증서 경로"),
      key: fs.readFileSync("도메인 비밀키 경로"),
      ca: [
        fs.readFileSync("상위 인증서 경로"),
        fs.readFileSync("상위 인증서 경로"),
      ],
    },
    (req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Server!</p>");
    }
  )
  // https는 보통 443 status code => 443으로 해야만 생략 가능
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다!");
  });
