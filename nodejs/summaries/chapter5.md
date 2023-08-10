# 섹션5. 익스프레스 웹 서버 만들기

진행상태: 진행중
기간: August 6, 2023

<aside>
💡 npm 트렌드 확인하기 : [https://npmtrends.com/](https://npmtrends.com/)
- 다운로드 수 많은 패키지 good
- 최근에도 update된 기록이 있는 패키지 good

</aside>

## express

- http 모듈로 웹 서버를 만들면 가독성 및 확장성이 떨어진다.
- express와 같은 프레임워크를 통해 코드 관리 및 편의성이 좋아진다.
- express는 내부적으로 http 서버를 사용하고 있기때문에 사실상 http를 쓰는 것과 동일하다.
- example
    
    ```jsx
    // app.js
    const express = require("express");
    
    const app = express();
    
    // 서버의 port라는 속성에 3000을 넣는다.
    app.set("port", process.env.PORT || 3000);
    
    app.get("/", (req, res) => {
      res.send("hello express");
    });
    
    app.listen(app.get("port"), () => {
      console.log("익스프레스 서버 실행");
    });
    ```
    
    - 만들어지지 않은 URI를 통해 요청했을 경우 알아서 404 코드를 보내준다.
    - 서버에서 에러 발생 시 알아서 500 코드를 보내준다.
        
        ![스크린샷 2023-08-08 오후 10.27.39.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB5%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%89%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%89%E1%85%B3%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20d751505752a84439923472277cc22667/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-08_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_10.27.39.png)
        
    
    ```jsx
    // package.js
    {
      "name": "my-express",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "start": "nodemon app"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "express": "^4.18.2"
      },
      "devDependencies": {
        "nodemon": "^3.0.1"
      }
    }
    ```
    
    - nodemon → 파일이 수정되면 알아서 서버를 재실행시켜준다.
        
        ![스크린샷 2023-08-08 오후 10.29.16.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB5%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%89%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%89%E1%85%B3%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20d751505752a84439923472277cc22667/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-08_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_10.29.16.png)
        

## express로 HTML 서빙하기

<aside>
💡 백엔드 개발자로서 쌓아둬야할 덕목
- HTTP, 운영체제, 데이터베이스, 네트워크

</aside>

- 현재 프로젝트에 특정 패키지 설치 여부 확인
    
    ```jsx
    npm ls express
    npm ll express
    npm list express
    ```
    
    ![스크린샷 2023-08-08 오후 11.18.56.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB5%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%89%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%89%E1%85%B3%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20d751505752a84439923472277cc22667/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-08_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_11.18.56.png)
    
- example : html 파일 보내기
    
    ```jsx
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });
    ```
    
    ![스크린샷 2023-08-08 오후 11.25.31.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB5%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%89%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%89%E1%85%B3%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20d751505752a84439923472277cc22667/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-08_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_11.25.31.png)
    

## 미들웨어 사용하기

<aside>
💡 라우터 = 메소드와 주소가 있다

</aside>

- 모든 요청에 실행된다.
- 중복되는 코드가 발생할 경우 미들웨어를 활용할 수 있다.
- next()를 해줘야만 다음 라우터로 넘어간다.
    
    ```jsx
    app.use((req, res, next) => {
      console.log("모든 요청에 실행한다");
      next();
    });
    ```
    
- 와일드 카드(:)
    - 와일드 카드를 사용하면 주소를 통해 요청된 데이터를 모두 받을 수 있다
        
        ```jsx
        app.get("/category/:name", (req, res) => {
          res.send(`hello wildcard`);
        });
        ```
        
    - 와일드 카드와 비슷한 주소를 가진 라우터가 있을 때,
        - 코드는 위→아래로 실행되기 때문에 와일드 카드가 먼저 정의된 경우 먼저 호출된다
        - 따라서 와일드 카드는 항상 다른 라우터들보다 아래에 위치해야한다.
        
        ```jsx
        app.get("/category/javascript", (req, res) => {
          res.send("hello javascript");
        });
        
        // 와일드 카드
        app.get("/category/:name", (req, res) => {
          res.send(`hello wildcard`);
        });
        ```
        
- 애스터리스크(*)
    - 모든 요청에 대해 어떠한 주소던지 처리하겠다
    - 범위가 넓기 때문에 아래에 위치해야한다.
    
    ```jsx
    app.get("*", (req, res) => {
      console.log("애스터리스크");
    });
    ```
    

## 미들웨어 특성

- 원하는 주소에 대해서만 실행하고 싶다면 앞에 주소를 작성하면 된다.
    
    ```jsx
    app.use("/about", (req, res, next) => {
      console.log("모든 요청에 실행한다");
      next();     // 이후에 아래의 /about 호출
    });
    
    app.get("/category/:name", (req, res) => {
      res.send(`hello wildcard`);
    });
    
    app.get("/about", (req, res) => {
      res.send("hello express");
    });
    
    // 모든 요청에 실행한다
    // hello express
    ```
    
- 여러 가지 미들웨어를 이어서 작성할 수 있다
    
    ```jsx
    app.use(
      (req, res, next) => {
        console.log("1 모든 요청에 실행한다");
        next();
      },
      (req, res, next) => {
        console.log("2 모든 요청에 실행한다");
        next();
      },
      (req, res, next) => {
        console.log("3 모든 요청에 실행한다");
        next();
      }
    );
    ```
    
    ![스크린샷 2023-08-10 오후 10.41.30.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB5%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%89%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A6%E1%84%89%E1%85%B3%20%E1%84%8B%E1%85%B0%E1%86%B8%20%E1%84%89%E1%85%A5%E1%84%87%E1%85%A5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%20d751505752a84439923472277cc22667/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-10_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_10.41.30.png)
    
- 에러처리
    - express는 에러를 처리해준다
    - 에러처리를 위해 미들웨어를 만들어준다.(안그러면 바로 화면으로 에러가 보여짐)
    - 에러 미들웨어의 매개변수는 반드시 4개여야한다! ⇒ 특히, next를 반드시 붙여놔야한다!!
    
    ```jsx
    // 만약 위에서 정의된 라우터 중 없다면 여기로 넘어오게된다! (에러 미들웨어는 아님)
    app.use((req, res) => {
      res.send("404!!!");
    });
    
    app.use((req, res) => {
    	try {
    		console.log(test);   // 선언되지 않은 변수이기 때문에 error 발생
    	} catch(e) {
    		// 매개변수가 있기때문에 에러 미들웨어로 넘어간다
    		// 매개변수 없는 next는 다음 미들웨어로 넘어간다
    		next(e);
    	}
    })
    
    // 에러 미들웨어
    app.use((err, req, res, next) => {
      console.error(err);
      res.send("에러 발생");
    });
    ```
    
- html → express를 사용하면서 축약된 코드
    - 서버의 status는 사실상 숨겨져 있다
        - 만약 기존의 response status를 그대로 보내면 해커들이 파악하고 위협을 가할 수 있기 때문에 오류 발생 시 404 status로 모두 보내는 케이스도 있다.
        
        ```jsx
        res.status(200).send("hello express");
        ```
        
    - html에서 header를 통해 보내야했던 데이터를 express에서는 알아서 보내준다
        
        ```jsx
        // html
        res.writeHead(200, {'Content-type': 'text/plain'});
        res.end('응답 보냄');
        
        // express
        res.send('응답 보냄');
        ```
        
    - json response
        
        ```jsx
        // html
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({hello: "hi"}));
        
        // express -> 알아서 contentType을 넣어준다
        res.json({hello: 'hi'});
        ```
        
- 한 request에는 한 response만 보낸다!
    
    ```jsx
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    
    	// 이미 한 번의 response를 보냈지만 이후에 다시 보내고 있어 에러 발생!
      res.send();
    	res.json({ hello: "hyein" });
    	res.writeHead();
      res.render()
    
    	// 만약 이 뒤에 로그를 찍는다면? -> 출력된다! javascript이기 때문에 return문이 없으면 response만 보내고 이후의 코드를 실행시키기 때문에 정상적으로 로그가 찍힌다
    	console.log('로그가 찍혀?')
    });
    ```
    
- next(”route”) - 같은 라우터가 2개 이상일 경우에 활용 가능
    
    ```jsx
    app.get(
      "/",
      (req, res, next) => {
        res.sendFile(path.join(__dirname, "index.html"));
        next("route");  // 아래 미들웨어를 실행하지 않고 바로 다음 동일한 미들웨어로 넘어간다!
      },
      (req, res) => {
        console.log("처음 라우터");  // 실행안됌
      }
    );
    
    app.get("/", (req, res) => {
      console.log("다음 라우터");    // 실행됨
    });
    ```
    
    ```jsx
    // 중복을 줄일 때 아래와 같이 활용할 수 있다
    app.get(
      "/",
      (req, res, next) => {
        res.sendFile(path.join(__dirname, "index.html"));
        if(true) {
    			next('route');
    		} else {
    			next();
    		}
      }
    );
    ```