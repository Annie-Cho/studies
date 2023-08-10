const express = require("express");
const path = require("path");

const app = express();

// middleware
// next를 해줘야만 다음 라우터로 넘어간다
app.use((req, res, next) => {
  console.log("1 모든 요청에 실행한다");
  next();
});

// 서버의 port라는 속성에 3000을 넣는다.
app.set("port", process.env.PORT || 3000);

app.get(
  "/",
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "index.html"));
    next("route");
  },
  (req, res) => {
    console.log("처음 라우터");
  }
);

app.get("/", (req, res) => {
  console.log("다음 라우터");
});

app.get("/about", (req, res) => {
  //   res.sendFile(path.join(__dirname, "index.html"));
  res.send("hello express");
});

// 와일드 카드를 통해 뒤의 데이터를 받을 수 있다
app.get("/category/:name", (req, res) => {
  //   res.send(`hello ${req.params.name}`);
  res.send(`hello wildcard`);
});

app.get("/about", (req, res) => {
  //   res.sendFile(path.join(__dirname, "index.html"));
  res.send("hello express");
});

// 코드는 위 -> 아래로 실행되기 때문에 위에 와일드 카드 URI가 있다면 req가 먼저 들어간다
// 따라서 와일드카드는 항상 다른 라우터들보다 아래에 위치해야한다.
app.get("/category/javascript", (req, res) => {
  res.send("hello javascript");
});

// 모든 get요청에 대해 어떠한 주소던지 처리하겠다
// 범위가 넓기 때문에 밑에 추가해준다.
// app.get("*", (req, res) => {
//   console.log("애스터리스크");
// });

app.use((req, res) => {
  res.send("404!!!");
});

// 에러 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.send("에러 발생");
});

app.listen(app.get("port"), () => {
  console.log("익스프레스 서버 실행");
});
