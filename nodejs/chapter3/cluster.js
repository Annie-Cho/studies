const cluster = require("cluster");
const http = require("http");

// 나의 CPU 개수 가져오기
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  // CPU 개수만큼 워커를 생산
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // 워커가 종료되었을 때
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log("code", code, "signal", signal);

    // 한 워커가 종료되었을 때 하나를 새롭게 만들어줌.
    cluster.fork();
  });
} else {
  // 워커들이 포트에서 대기
  // 워커 프로세스에서 서버를 띄운다
  http
    .createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Cluster!</p>");
      setTimeout(() => {
        // 워커 존재를 확인하기 위해 1초마다 강제 종료
        // 여기에서 서버를 끄게되면 마스터 프로세스에서 exit이 실행된다
        process.exit(1);
      }, 1000);
    })
    .listen(8086); // 6개의 서버를 하나의 포트에 묶어놓을 수 있기 때문에 각각의 포트가 필요없다

  console.log(`${process.pid}번 워커 실행`);
}
