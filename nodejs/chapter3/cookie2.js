const http = require("http");
const fs = require("fs").promises;
const path = require("path");

// 쿠키에 저장된 값을 가져와서 객체로 바꿔주는 메소드
const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

http
  .createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
    // 주소가 /login으로 시작하는 경우
    if (req.url.startsWith("/login")) {
      // url을 가져와서 안에 들어있는 queryString(searchParams)를 가져온다!
      const url = new URL(req.url, "http://localhost:8084");
      const name = url.searchParams.get("name");
      const expires = new Date();
      // 쿠키 유효 시간을 현재시간 + 5분으로 설정
      expires.setMinutes(expires.getMinutes() + 5);
      res.writeHead(302, {
        // 302로 하면 리다이렉트하라!(혹은 301)
        // expires -> 쿠키 만료기간(유효기간을 설정해놓으면 브라우저가 만기되었는지를 확인한다)
        // httpOnly -> JavaScript로 쿠키에 접근하지 못하도록한다(보안에 위협), 로그인을 사용할 경우 HttpOnly반드시 붙여야함! 해커들에 JavaScript언어로 쿠키를 탈취할 수 있다
        // path -> /(슬래쉬) 아래에 있는 주소에서는 쿠키가 모두 유효하다
        Location: "/",
        "Set-Cookie": `name=${encodeURIComponent(
          name
        )}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
      });
      res.end();
      // name이라는 쿠키가 있는 경우
    } else if (cookies.name) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`${cookies.name}님 안녕하세요`);
    } else {
      try {
        const data = await fs.readFile(path.join(__dirname, "cookie2.html"));
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(err.message);
      }
    }
  })
  .listen(8084, () => {
    console.log("8084번 포트에서 서버 대기 중입니다!");
  });
