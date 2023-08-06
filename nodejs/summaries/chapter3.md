# 섹션3. http 모듈로 서버 만들기

진행상태: 완강
기간: July 30, 2023 → August 5, 2023

## HTTP 서버 만들기

### 서버와 클라이언트

![스크린샷 2023-08-05 오전 7.17.55.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_7.17.55.png)

- 클라이언트 → 서버 `요청`
- 서버 → 클라이언트 `응답`

<aside>
💡 HTTP 프로토콜을 잘 알고 있어야한다

</aside>

### 서버 port

- 모든 서버들은 실제로 포트가 하나씩 다 존재한다
- 하나의 도메인에서 포트 번호마다 다른 프로그램으로 동시에 연결해놓을 수 있다
⇒ 즉, 하나의 주소 밑에 여러 개의 프로그램을 띄워놓는다
- 프로토콜에 따른 포트
    - `https` ⇒ 기본적으로 포트가 443이고 생략 가능    ex) www.naver.com:443
    - `http` ⇒ 기본적으로 포트가 80이고 생략 가능
- 다만, localhost는 로컬에서만 접근 가능하고 포트 8080은 생략할 수 없음
- 포트 하나가 하나의 프로그램

### 간단한 서버 만들기 example

- 서버를 킨 상태에서 코드를 수정하면 서버를 종료했다 다시 실행해야지만 수정본이 반영된다.

```jsx
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
```

```jsx
// listen의 callback을 분리할 수도 있다
server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기 중입니다.");
});
```

## fs로 HTML 읽어 제공하기

- html로 작성된 파일을 새로 생성하여 fs로 읽어 응답해주는 것이 훨씬 깔끔하다

<aside>
💡 async / await 구문을 사용할 경우 항상 에러 처리해주기!!

</aside>

```
const http = require("http");
const fs = require("fs").promises;

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
```

## REST API 서버 만들기

- 서버에 요청을 보낼 때에는 주소를 통해 요청의 내용을 표현한다
    - /index.html일 경우 index.html을 보내달라는 뜻
- 보통 서버에서 정해준대로 클라이언트가 따라간다

### REST API(Representational State Transfer)

- 서버의 자원을 정의하고 자원에 대한 주소를 지정한다
- REST API의 경우 예측이 가능하기 때문에 보안을 철저히 해야한다
- 요청 메소드
    - `GET` : 서버의 자원(리소스)을 가져오려고 할 때 사용
    - `POST` : 서버에 자원을 새로 등록하고자 할 때 사용(혹은 뭘 써야할 지 애매할 때 ex. 로그인)
    - `PUT` : 서버의 자원을 요청에 들어있는 자원으로 치환하고자 할 때 사용 ex) 전체수정
    - `PATCH` : 서버 자원의 일부만 수정하고자 할 때 사용 ex) 부분수정
    - `DELETE` : 서버 자원을 삭제하고자 할 때 사용
- RESTful하다 → REST API를 사용한 주소 체계를 이용하는 서버
- RESTful 하기 위해서는 주소에 동사가 쓰일 수 없지만 login과 같은 경우에는 달리 표현할 방법이 없을 경우가 있다
    
    <aside>
    💡 RESTful한 것도 좋지만 의미전달이 잘 되도록 최대한 주소를 깔끔하게 사용하자
    
    </aside>
    
- HTTP 프로토콜
    - 클라이언트가 누구든 서버와 HTTP 프로토콜로 소통 가능
- Response-Header
    - 데이터에 대한 데이터
    - 응답에 대한 정보를 알려준다
        - ex) html을 응답한다면, 응답이 html이고 utf-8로 한글 쓸 수 있음 알려주고 성공했다고 알려주고 등등
- Request-Header
    - host → localhost:8082
    - accept-language → 한글도 사용하겠다
    - accept-encoding → 압축된 파일로 응답한다면 우리(브라우저)가 풀어주겠다
    - accept → accept에 나열된 타입들로 응답 시 받겠다 → 서버에게 이런 형식대로 보내달라고 요구

## POST, PUT, DELETE 요청 보내기

- 예시 코드
    
    ```jsx
    const http = require("http");
    const fs = require("fs").promises;
    const path = require("path");
    
    const users = {}; // 데이터 저장용
    
    // 서버생성(포트 : 8082)
    http
      .createServer(async (req, res) => {
        try {
          if (req.method === "GET") {
            // 메소드 : GET, URL : /(슬래쉬)
            if (req.url === "/") {
              const data = await fs.readFile(
                path.join(__dirname, "restFront.html")
              );
              res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); // 성공(200), writeHead : 헤더를 작성한다
              return res.end(data);
            } else if (req.url === "/about") {
              const data = await fs.readFile(path.join(__dirname, "about.html"));
              res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
              return res.end(data);
            } else if (req.url === "/users") {
              res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
              });
              return res.end(JSON.stringify(users));
            }
            // /도 /about도 /users도 아니면
            try {
              const data = await fs.readFile(path.join(__dirname, req.url));
              return res.end(data);
            } catch (err) {
              // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
            }
          } else if (req.method === "POST") {
            if (req.url === "/user") {
              let body = "";
              // 요청의 body를 stream 형식으로 받음
              req.on("data", (data) => {
                body += data;
              });
              // 요청의 body를 다 받은 후 실행됨
              return req.on("end", () => {
                console.log("POST 본문(Body):", body);
                const { name } = JSON.parse(body); // request된 객체를 똑같이 서버에서 받으려면 위의 과정이 필요하다
                const id = Date.now();
                users[id] = name;
                res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("등록 성공");
              });
            }
          } else if (req.method === "PUT") {
            if (req.url.startsWith("/user/")) {
              const key = req.url.split("/")[2];
              let body = "";
              req.on("data", (data) => {
                body += data;
              });
              return req.on("end", () => {
                console.log("PUT 본문(Body):", body);
                users[key] = JSON.parse(body).name;
                res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
                return res.end(JSON.stringify(users));
              });
            }
          } else if (req.method === "DELETE") {
            if (req.url.startsWith("/user/")) {
              const key = req.url.split("/")[2];
              delete users[key];
              res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
              return res.end(JSON.stringify(users));
            }
          }
          // 해당하는 메소드 및 URL이 없을 경우 실행
          res.writeHead(404);
          return res.end("NOT FOUND");
        } catch (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(err.message);
        }
      })
      .listen(8082, () => {
        console.log("8082번 포트에서 서버 대기 중입니다");
      });
    ```
    
- HTTP Status Code
    - 200(OK) : 성공
    - 201(Created) : 성공적으로 생성되었다
    - 403(Forbidden) : 권한때문에 거절
    - 404(Not Found): 자원을 못찾은 경우
    - 409(Conflict) : 서버의 현재상태와 요청이 충돌함 → 극히 드뭄
    - 500 : 요청처리하다 서버가 고장났다
    - 503 : 서버로부터 유용하지 않은 응답을 받았다

## 쿠키와 세션

- 요청을 보낼 때 서버는 그 요청을 누가 보냈는지 알 수 없다
⇒ IP, 브라우저는 알 수 있지만 정확히 누군지는 알 수 없다
- 따라서 로그인, 로그아웃 기능을 사용한다

### 쿠키

- `키=값` 의 쌍
    - ex) name=annie
- 브라우저를 닫으면 쿠키가 사라진다.
- 쿠키 사용하기
    - 서버 → 클라이언트로 쿠키와 함께 응답
    - 브라우저는 쿠키를 저장하고 있다가 서버에 쿠키와 함께 요청
    - 서버에서는 쿠키를 읽어들인다
        
        ![스크린샷 2023-08-05 오전 9.51.49.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.51.49.png)
        
- 쿠키 서버
    - 쿠키 추가하기
        - writeHead를 통해 `Set-Cookie` 로 쿠키 추가
        - 이후 요청부터는 브라우저가 알아서 전달
        
        ```jsx
        res.writeHead(200, {'Set-Cookie': 'mycookie=test'});
        ```
        
    - 쿠키 읽어오기
        - Header에 들어있는 쿠키를 가지고 온다
        
        ```jsx
        req.headers.cookie;
        ```
        
- Header 설정
    
    ```jsx
    res.writeHead(302, {
      // 302로 하면 리다이렉트하라!(혹은 301)
      Location: "/",
      "Set-Cookie": `name=${encodeURIComponent(
        name
      )}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    ```
    
    - `Expires` : 쿠키 만료기간(날짜) → 유효기간을 설정해놓으면 브라우저가 만기되었는지를 확인한다
    - `HttpOnly` : JavaScript로 쿠키에 접근하지 못하도록한다(보안에 위협)
        - 로그인을 사용할 경우 HttpOnly반드시 붙여야한다! 해커들에 JavaScript언어로 쿠키를 탈취할 수 있다
    - `path` : /(슬래쉬) 아래에 있는 주소에서는 쿠키가 모두 유효하다
    - `Max-age` : Expires와 비슷하지만 날짜 대신 초를 입력한다. (Expires보다 우선한다)
- example
    
    ```jsx
    const http = require("http");
    
    http
      .createServer((req, res) => {
        console.log(req.url, req.headers.cookie);
        res.writeHead(200, { "Set-Cookie": "mycookie=test" });
        res.end("Hello Cookie");
      })
      .listen(8083, () => {
        console.log("8083번 포트에서 서버 대기 중입니다!");
      });
    ```
    
    ![스크린샷 2023-08-05 오전 9.57.54.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.57.54.png)
    
    ![스크린샷 2023-08-05 오전 9.59.42.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.59.42.png)
    
    - 서버를 실행한 후 console.log()를 찍을 때 favicon.ico 가 출력되는 이유
        
        ![스크린샷 2023-08-05 오전 10.17.18.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.17.18.png)
        
        - 크롬 브라우저에서 favicon 아이콘을 찾기 위해서 알아서 보내준다.(각 탭들의 아이콘을 출력하기 위해서 favicon 아이콘 호출)
- example2
    
    ```jsx
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
    ```
    
- 요청 주소나 쿠키에 한글이 입력되면 문제가 되기 때문에 `encodeURIComponent`로 한글을 인코딩해주어서 아래와 같이 쿠키가 보이게된다.

### 헤더와 본문

- request-payload → 본문 body, 요청의 데이터
- http 요청, 응답은 헤더와 본문을 가진다
    - `Header` : 요청 또는 응답에 대한 정보를 가진다(데이터들에 대한 데이터)
    - `Body` : 주고받는 실제 데이터
    - (추가) 쿠키는 부가적인 정보이기 때문에 Header에 저장

## 세션

- 쿠키 정보는 노출되고 수정되는 위험이 있다
- 세션을 활용하는 방법
    - 중요한 정보는 서버에서 가지고 있고 정보에 접속할 수 있는 key(의미없는 데이터)만 브라우저로 보내 브라우저에서는 중요한 정보를 알 수 없게 설계한다
- example
    
    ```jsx
    const http = require("http");
    const fs = require("fs").promises;
    const path = require("path");
    
    const parseCookies = (cookie = "") =>
      cookie
        .split(";")
        .map((v) => v.split("="))
        .reduce((acc, [k, v]) => {
          acc[k.trim()] = decodeURIComponent(v);
          return acc;
        }, {});
    
    // 세션객체(데이터 저장용)
    const session = {};
    
    http
      .createServer(async (req, res) => {
        const cookies = parseCookies(req.headers.cookie);
        if (req.url.startsWith("/login")) {
          const url = new URL(req.url, "http://localhost:8085");
          const name = url.searchParams.get("name");
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 5);
          const uniqueInt = Date.now(); // uniqueInt -> 키(겹치지 않도록 만들어야한다)
          session[uniqueInt] = {
            name,
            expires,
          };
          res.writeHead(302, {
            Location: "/",
            "Set-Cookie": `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
          });
          res.end();
          // 세션쿠키가 존재하고, 만료 기간이 지나지 않았다면
        } else if (
          cookies.session &&
          session[cookies.session].expires > new Date()
        ) {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(`${session[cookies.session].name}님 안녕하세요`); // 검사를 모두 마치면 session에서 꺼내온다
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
      .listen(8085, () => {
        console.log("8085번 포트에서 서버 대기 중입니다!");
      });
    ```
    

## https, http2

- 데이터가 암호화되어 중간에 해커가 데이터를 탈취하더라도 풀기 어려워진다

### https

- 웹 서버에 SSL 암호화를 추가하는 모듈
- example
    
    ```jsx
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
    ```
    

### http2

- SSL 암호화와 더불에 최신 HTTP 프로토콜인 http/2 를 사용하는 모듈
- http/1.1보다 동시성을 개선
- 실제적으로 작은 이미지가 수백개 있다면 http는 하나씩 받아와야하지만 http2에서는 한방에 받아올 수 있다
- http/2를 활용할 경우 https도 함께 적용해주는게 좋다! (속도, 보안 good)

![스크린샷 2023-08-05 오전 11.40.17.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_11.40.17.png)

- example
    
    ```jsx
    const http2 = require("http2");
    const fs = require("fs");
    
    http2
      .createSecureServer(
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
      .listen(443, () => {
        console.log("443번 포트에서 서버 대기 중입니다!");
      });
    ```
    

<aside>
💡 개발 → HTTP 사용
실무 및 배포 → HTTP2 사용

</aside>

## Cluster

<aside>
💡 HTTP2 적용하면서 실무에서 Cluster를 적용하는 것이 좋음

</aside>

- 기본적으로 싱글 스레드인 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈
- 요청이 서버 개수만큼 분산된다
- 단, 코어를 8개 모두 사용한다고 성능이 8배가 되는 것은 아님 → 멀티스레드 관리에도 비용이 듦
- 단점 : 프로세스를 코어 갯수만큼 띄우는 거라 서로 메모리나 세션을 공유하지 못함 ⇒ Redis로 메모리 해결
- 클러스터는 프로세스를 여러개 만든다.

### 마스터 프로세스 - 워커 프로세스

- 마스터 프로세스는 서버 역할 보다는 라운드로빈 알고리즘에 따라 워커 프로세스에 분배

<aside>
💡 실무에서는
- HTTP2 적용
- Cluster 적용 (서버가 에러로 인해 종료되더라도 다시 킨다, 코어 갯수만큼 여러 대의 서버를 마련할 수 있다)

</aside>

- example
    - 서버는 8개다! (내 컴퓨터는 8코어)
    
    ```jsx
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
    ```
    
    - cluster.fork()를 해주는 경우 워커가 종료되고 새로운 워커가 실행된다
        
        ![스크린샷 2023-08-05 오후 12.00.36.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.00.36.png)
        
    - cluster.fork()를 안해주는 경우 워커를 종료하면 그대로 종료된다
        
        ![스크린샷 2023-08-05 오후 12.00.47.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB3%20http%20%E1%84%86%E1%85%A9%E1%84%83%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A9%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20f56218cc609047209b5127c04329a209/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-05_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.00.47.png)