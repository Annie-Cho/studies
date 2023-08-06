# 섹션2. 노드 기본 기능 익히기

진행상태: 완강
기간: July 23, 2023 → July 30, 2023

## REPL 사용하기

- R(Read), E(Evaluate), P(Print), L(Loop)
- js파일에 쓰면 먼저 읽고, 실행하고, 결과를 출력하고, 반복한다.
- console.log() 자체는 undefined를 return한다
    
    ![스크린샷 2023-07-23 오후 11.33.18.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-23_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_11.33.18.png)
    

## CommonJS 모듈 시스템

- 모듈 : 특정한 기능을 하는 함수나 변수들의 집합
- module.exports 는 파일에서 단 한 번만 써야한다.

```jsx
// var.js
const odd = "홀수입니다";
const even = "짝수입니다";

// 객체로 넘겨주기 -> 보통 한 개 이상의 값을 넘겨줄 때는 객체를 활용한다!
module.exports = {
  odd,
  even,
};

// 배열로 넘겨주기
// module.exports = [odd, even];
```

```jsx
// func.js
const { odd, even } = require("./var");

function checkOddOrEven(number) {
  if (number % 2) {
    return odd;
  } else {
    return even;
  }
}

module.exports = checkOddOrEven;
```

```jsx
// index.js
const { odd, even } = require("./var"); // 구조 분해 할당
const checkNumber = require("./func"); // 원하는 변수로 가져오기 가능

function checkStringOddOrEven(str) {
  if (str.length % 2) {
    return odd;
  } else {
    return even;
  }
}

console.log(checkNumber(10));                  // 짝수입니다
console.log(checkStringOddOrEven("hello"));    // 홀수입니다
```

## exports, this, require, 순환참조

### exports

- module 생략 가능
    - but, exports와 module.exports를 동시에 쓰면 다시 덮어씌워지기 때문에 같이 쓸 수 없다.
    
    ```jsx
    module.exports === exports === {}    // 빈 객체와 같다
    ```
    
    ```jsx
    // var.js
    const odd = "홀수입니다";
    const even = "짝수입니다";
    
    exports.odd = odd;
    exports.even = even;
    
    // module.exports = { odd, even };
    
    // 이렇게도 할 수는 있지만 사용 안함
    // this.odd = odd;
    // this.even = even;
    ```
    
- 참조 관계가 끊기는 경우
    
    ```jsx
    // module.exports !== exports
    
    // 함수를 대입할 경우
    module.exports = checkOddOrEven;
    
    // 새로운 객체를 대입할 경우
    module.exports = {}
    ```
    

### this

- Node에서 scope에 따른 this
    - 전역 스코프의 `this` → 빈 객체
    - 지역 스코프의 `this` → global
    
    ```jsx
    console.log(this);                        // {}
    console.log(this === module.exports);     // true
    
    function a() {
      console.log(this === global);           // true
    }
    a();
    ```
    

## require

- 한 번 require된 정보는 require안에 cache에 저장한다. → 캐싱한다 ⇒ 메모리에 저장된다.
- 다른 파일에서 한번 더 var를 불러올 경우 var파일을 안읽고 캐시(메모리)에 저장된 데이터를 불러온다.
⇒ 파일을 한 번만 읽고 메모리에서 불러오기 때문에 속도가 빠르다.
- require이 담고있는 정보
    - var.js가 cache되어있는 걸 확인할 수 있음.
    
    ```jsx
    require("./var");
    console.log(require);
    ```
    
    ![스크린샷 2023-07-29 오전 9.54.48.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.54.48.png)
    
    - 캐싱이란?
        - 하드디스크에서 메모리 디스크로 옮겨오는 행위
- but, 내장되어있는 객체를 손대는 건 위험하다.
- Node에서는 파일이 실행된 상태에서 코드를 수정하면 껐다가 켜야지 새로운 코드가 적용되지만 캐시를 잘 활용하면 껐다가 키지 않아도 실시간으로 코드를 업데이트할 수 있다!  ex) nodemon?
- 특징
    - 반드시 제일 위에 올 필요 없다.
    - require.cache에 한 번 require된 모듈에 대한 캐시 정보가 담겨있다.
    - require.main은 노드 실행 시 첫 모듈을 가리킨다.
    - 예시
        
        ```jsx
        console.log("시작");
        
        module.exports = "신기하군";
        
        require("./var");
        
        console.log(require.cache);
        console.log(require.main === module);
        console.log(require.main.filename);
        
        // 번외
        // 아래와 같이 다른 모듈의 exports를 꺼내올 수 있다! -> but 직접 내장 객체에 손대는 건 위험하여 사용하지 않는다. 신기하니까 테스트만 :)
        console.log(
          require.cache["/Users/chohyein/Documents/study/node/javascript/3강/var.js"]
            .exports.odd
        );
        ```
        
        ![스크린샷 2023-07-29 오전 10.03.23.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.03.23.png)
        

### 순환 참조

- 순환 참조 발생
    - dep1이 dep2를 참조하고 dep2로 갔더니 dep1을 참조하고 무한적으로 참조한다
    
    ```jsx
    // dep1.js
    require('./dep2');
    
    // dep2.js
    require('./dep1');
    ```
    
    - 순환 참조가 발견되면 Node는 dep1 실행 후 dep2로 갔을 때 exports를 빈 객체로 바꿔버린다.
    ⇒ 차단해버린다.

<aside>
💡 최대한 순환참조를 하지 않도록 하자!

</aside>

## ECMA Script 모듈, 다이나믹 임포트, top level await

### ECMA Script 모듈(import, export default) / top level await

- ECMA Script 모듈 = ES 모듈
- 공식적인 Javascript 모듈 형식
- Node도 commonJS → ES모듈로 넘어가는 추세

```jsx
// var.mjs
export const odd = '홀수입니다.';      // named export
export const even = '짝수입니다.';
```

```jsx
import {odd, even} from './var.mjs';
import checkNumber from './func.mjs';

function checkOddOrEven(){
 ...
}

export default checkOddOrEven;      // default export
```

- mjs 확장자 대신 js 확장자를 사용하고 ES모듈을 사용하려면 package.json에 type 속성을 넣어주어야 한다.
    
    ```jsx
    type: "module"
    ```
    
- 확장자는 반드시 붙여주어야한다!
- CommonJS와 ECMA Script 모듈 차이점
    
    ![스크린샷 2023-07-29 오전 10.52.45.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.52.45.png)
    
    - ES모듈에서는 script에서 바로 await를 써도 정상적으로 동작한다!
        
        ```jsx
        await a(); 
        ```
        

### 다이나믹 임포트

- CommonJS에서는 가능하나 ES모듈에서는 사용 불가
- ES모듈에서는 반드시 import 구문은 최상단에 선언되어야 한다.
- ex)
    
    ```jsx
    const a = true;
    if(a) {
    	require('./func');       // 가능(CommonJS)
      import('./func');        // 불가능(ES모듈)
    }
    ```
    
- ES 모듈에서 다이내믹 임포트가 필요할 경우 import() 함수를 활용한다
    - default로 export 할 경우 m1, 객체에 전달해줬을 경우 m2 처럼 된다.
    
    ![스크린샷 2023-07-29 오전 11.46.31.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_11.46.31.png)
    

## [노드 내장 객체] global, console, 타이머

### global

![스크린샷 2023-07-29 오전 11.53.31.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_11.53.31.png)

- 브라우저의 window 같은 역할
- 사실상 require, console, module 등은 global이 생략된 표현이다
    
    ```jsx
    global.require
    global.console.log
    global.module.exports
    ```
    
- global 속성에 값을 대입하면 다른 파일에서도 사용 가능하지만 어디에서 대입됐는지 모르므로 왠만하면 사용하지 않는다.
    
    ```jsx
    // globalA.js
    module.exports = () => global.message;
    
    // globalB.js
    const A = require('./globalA');
    global.message = 'hello';          // 접근 가능
    ```
    

### console

- 종류
    - console.time, console.timeEnd : 시간 로깅
    - console.error : 에러 로깅
    - console.log : 평범한 로그
    - console.dir : 객체 로깅
    - console.trace : 호출스택 로깅
    - console.table : 테이블 형태로 로깅

### 타이머

- 종류
    - setTimeout(콜백함수, 밀리초) : 주어진 밀리초 이후에 콜백 함수 실행 (비동기 코드)
    - setInterval(콜백함수, 밀리초) : 주어진 밀리초마다 콜백 함수를 반복 실행 (비동기 코드)
    - setImmediate(콜백함수) : 콜백 함수를 즉시 실행 (비동기 코드)
    - clearTimeout(아이디) : setTimeout 취소
    - clearInterval(아이디) : setInterval 취소
    - clearImmediate(아이디) : setImmediate 취소
    
    ```jsx
    // 취소하기 위해서는 변수에 저장하고 해당 변수를 이용해서 취소한다.
    const hello = setInterval(() => console.log('hi'), 2000);
    
    clearInterval(hello);
    ```
    
- setImmediate를 활용하여 어떤 코드들은 동시에 바로 실행되도록 백그라운드로 보낼 수 있다.
- setImmediate가 바로 출력되지만 취소시킬 수 있다!
⇒ setImmediate가 실행되기 위해 `백그라운드 → 태스크 큐 → 호출스택(이벤트 루프)`으로 가기 때문에 호출 스택까지 가기 전에 clearImmediate() 실행하면 취소할 수 있다!
    
    ```jsx
    const immediate = setImmediate(() => console.log('hi'));
    
    clearImmediate(immediate);        // setImmediate실행되지 않고 취소됨
    ```
    

## process

- 현재 실행중인 노드 프로세스에 대한 정보를 담고 있음
    
    ![스크린샷 2023-07-29 오후 12.13.58.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.13.58.png)
    
- ex)
    
    ![스크린샷 2023-07-29 오후 12.17.39.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.17.39.png)
    
    - `version` : 노드 버전
    - `arch` : 프로세스 아키텍처 정보
    - `platform` : OS 플랫폼 정보
    - `pid` : 프로세스 id → pid를 통해 프로세스 shutdown 가능
    - `cwd` : 현재 프로세스가 실행된 위치  → 경로체크할 때 자주 사용됨
    - `cpuUsage()` : 현재 cpu 사용량

### process.env(환경변수)

- 환경변수는 process.env로 접근
    
    ```jsx
    const secretKey = process.env.SECRET_KEY;
    ```
    
- 일부 환경변수는 노드 실행 시 영향을 미친다.
    
    ```jsx
    NODE_OPTIONS=-max-old-space-size=8192    // 노드 실행 옵션
    UV_THREADPOOL_SIZE=8                     // 스레드풀 개수
    ```
    

### process.nextTick(콜백함수)

- 이벤트 루프가 다른 콜백 함수들보다 nextTick의 콜백 함수를 우선적으로 처리함
- Promise와 마찬가지로 우선순위 높음 (nextTick > promise > setImmediate or setTimeout)

```jsx
setImmediate(() => console.log("immediate"));

process.nextTick(() => console.log("nextTick"));

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));
```

![스크린샷 2023-07-29 오후 12.28.28.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-29_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.28.28.png)

### process.exit()

- 서버를 종료하려고 할 때 서버 내에서 process.exit()해주면 종료된다.
    - `process.exit(0)` → 0일 경우 에러 없이 종료한다
    - `process.exit(1)` → 1일 경우 에러가 존재하는 상태로 종료한다

## OS와 path

### OS

- OS : 내장 모듈
    
    ```jsx
    const os = require('os');
    
    console.log('메모리 정보');
    console.log(os.cpus());           // cpu 코어 정보
    ```
    
    <aside>
    💡 OS 스레드와 node 스레드는 다른 스레드! 헷갈리지 말것!
    
    </aside>
    
    - Node.js docs - [https://nodejs.org/dist/latest-v20.x/docs/api/os.html](https://nodejs.org/dist/latest-v20.x/docs/api/os.html)

### path

```jsx
const path = require('path');

path.join(__dirname, '..', '/var.js');
path.resolve(__dirname, '..', '/var.js');    // resolve는 절대경로로 가버린다

// 결과
// /Users/chohyein/Documents/study/node/javascript/var.js
// /var.js
```

- OS마다 다른 path 구성
    - window → `\javascript\study\test.js`
    - posix(mac or linux) → `/javascript/study/test.js`
- path.join(경로, …) : 상대경로로 처리. 여러 인자를 넣을 경우 하나의 경로로 합쳐준다.
- path.resolve(경로, …) : 절대경로로 처리(위 예시 보기)
- 상대경로 / 절대경로
    - 상대경로 : 현재 파일 기준. 같은 경로면 점 하나(.), 상위 경로면 점 두개(..)
    - 절대경로 : root 폴더나 노드 프로세스가 실행되는 위치 기준

## 노드 내장 모듈(url, dns)과  searchParams

### url

- 원래는 url처리 시 두 가지 방식(node, WHARWG - 웹 표준)이 있었는데 이제는 웹 표준으로 통일
- WHATWG 체계 (아래 그림 잘 기억할 것!!⭐️⭐️⭐️⭐️⭐️)
    
    ![스크린샷 2023-07-30 오전 9.24.12.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.24.12.png)
    
    - user, pass에 아이디와 비밀번호를 입력하는 공간을 지원해준다.
    - #hash는 서버는 인식을 못하고 브라우저만 인식할 수 있다.
    
    ```jsx
    const url = require("url");
    
    const { URL } = url;
    // 객체 생성
    const newUrl = new URL(
      "http://www.gilbut.co.kr/book/booklist.aspx?sercate1=001001000#anchor"
    );
    
    console.log("new URL() : ", newUrl);
    // 객체를 다시 문자열로 변경
    console.log("url.format() : ", url.format(newUrl));
    ```
    
    ![스크린샷 2023-07-30 오전 9.32.54.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.32.54.png)
    

### searchParams

- searchParams → search 객체화
- Iterator 객체 (배열처럼 반복 작업을 쉽게 만들어주는 객체)
- append를 통해 2번 설정할 경우 배열로 처리된다!
    
    ```jsx
    newURL.searchParams.append('filter', 'es3');
    newURL.searchParams.append('filter', 'es5');
    ```
    
    ![스크린샷 2023-07-30 오전 9.50.45.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_9.50.45.png)
    

### dns

- 도메인을 가지고 다양한 방법으로 활용할 수 있게 여러 설정을 할 수 있다
- 각각의 설정 → record
- node가 특정 서버의 ip주소를 알아내야할 때 사용
- dns.resolve()를 통해 조회할 수 있다.

```jsx
// domain : gilbut.co.kr

// ip주소
const ip = await dns.lookup('gilbut.co.kr');

// ip주소
const a = await dns.resolve('gilbut.co.kr', 'A');

// ip주소(ipv6)
const aaaa = await dns.resolve('gilbut.co.kr', 'AAAA');

// 메일 서버
const mx = await dns.resolve('gilbut.co.kr', 'MX');

// www를 붙여도 동일한 도메인으로 연결하기 (별명) 
const cname = await dns.resolve('www.gilbut.co.kr', 'CNAME');
```

- 콘솔
    
    ![스크린샷 2023-07-30 오전 10.08.26.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.08.26.png)
    
    ![스크린샷 2023-07-30 오전 10.08.54.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.08.54.png)
    

## crypto / util

### crypto(단방향 암호화)

- 암호화 / 복호화
    - 암호화 : 평문 → 암호
    - 복호화 : 암호 → 평문
- 암호화는 가능하지만 복호화는 불가
- Hash 기법
    - 평문을 암호와 같이 만들지만 다시 평문으로 되돌릴 수 없다.
    - 대신 평문을 hash화 하면 항상 동일한 암호 값이 생성되어 비밀번호 같은 값들에 활용할 수 있다.

```jsx
const crypto = require('crypto');

// createHash(알고리즘) : 사용할 해시 알고리즘
// update(문자열) : 변환할 문자열
// digest(인코딩) : 인코딩할 알고리즘
crypto.createHash('sha512').update('password').digest('base64')
```

- 암호화 알고리즘
    - pbkdf2, bcrypt, scrypt 알고리즘으로 비밀번호 암호화 가능
    - node에서는 bcrypt를 지원해주지 않기 때문에 pbkdf2를 활용해야한다.
    - pbkdf2는 salt와 암호화된 hash 값을 모두 저장해두어야한다.

### crypto(양방향 암호화)

- 암호화, 복호화 모두 가능
    
    ![스크린샷 2023-07-30 오후 12.52.26.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.52.26.png)
    
- 대칭형 암호화 : 암호화 및 복호화 때 같은 key를 사용해야 함
- key를 훔쳐갈 수 있기 때문에 key 관리를 잘 해야한다.
- 프론트의 코드는 모두 공개되어있기 때문에 프론트-서버 관계에서는 같은 key를 사용하면 안됀다!
⇒ 대칭형 암호화 사용 불가
- 비밀번호 관리 전략
    - AWS Key Management Service(KMS)

### util

- 각종 편의 기능을 모아둔 모듈
    - deprecated
        - util.deprecated()로 함수를 감싸준다
        - 해당 함수를 사용할 때마다 작성된 경고가 출력된다.
        
        ```jsx
        const util = require('util');
        
        const dontUseMe = util.deprecated((x, y) => {
        	console.log(x + y);
        }, 'deprecated된 함수입니다.')
        ```
        
    - promisify
        - callback함수에서 promise로 변화하고 있는 추세인데, callback을 없애면 지금 사용하고 있는 코드들에서 문제가 될 수 있기 때문에 promisify로 callback함수를 한 번 감싸서 사용한다.
        - promisify를 활용하면 then, catch를 사용할 수 있음. (await도 사용 가능)
        - 단, callback함수는 (error, data) ⇒ {}
        
        ```jsx
        const randomBytesPromise = util.promisify(crypto.randombytes);
        randomBytesPromise(64)
        	.then(...)
        	.catch(...)
        ```
        

## worker_threads

- 노드에서 멀티스레드 방식으로 작업할 수 있다
- 워커 스레드를 활용하는 방법
    1. 메인 스레드에서 워커 스레드 생성 후 작업  분배
    2. 워커 스레드에서 작업 시작
    3. 워커 스레드에서 작업을 마치면 메인 스레드로 전달
    4. 메인 스레드에서 워커 스레드들의 작업을 합쳐 최종적인 결과물 전달
- 1개의 워커 스레드 활용 예시
    
    ```jsx
    const { Worker, isMainThread, parentPort } = require("worker_threads");
    
    if (isMainThread) {
      // 메인 스레드
      const worker = new Worker(__filename);
    
      worker.on("message", (value) => {
        console.log("워커로부터 ", value);
      });
      worker.on("exit", () => {
        console.log("워커 끝");
      });
    
      worker.postMessage("ping");
    } else {
      // 워커 스레드
      parentPort.on("message", (value) => {
        console.log("부모로부터 ", value);
        parentPort.postMessage("pong");
        parentPort.close();
      });
    }
    ```
    
    ![스크린샷 2023-07-30 오후 1.11.36.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.11.36.png)
    
- 2개의 워커 스레드 활용 예시
    
    ```jsx
    const {
      Worker,
      isMainThread,
      parentPort,
      workerData,
    } = require("worker_threads");
    
    if (isMainThread) {
      // 메인 스레드
      const threads = new Set();
      threads.add(
        new Worker(__filename, {
          workerData: { start: 1 },
        })
      );
      threads.add(
        new Worker(__filename, {
          workerData: { start: 2 },
        })
      );
      for (let worker of threads) {
        worker.on("message", (value) => {
          console.log("워커로부터 ", value);
        });
        worker.on("exit", () => {
          threads.delete(worker);
          if (threads.size === 0) {
            console.log("워커 끝");
          }
        });
      }
    } else {
      // 워커 스레드
      const data = workerData;
      parentPort.postMessage(data.start + 100);
    }
    ```
    
    ![스크린샷 2023-07-30 오후 1.18.52.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.18.52.png)
    
- 워커 스레드를 활용하여 소수 구하기
    
    ```jsx
    const {
      Worker,
      isMainThread,
      parentPort,
      workerData,
    } = require("worker_threads");
    
    const min = 2;
    let primes = [];
    
    function findPrimes(start, range) {
      let isPrime = true;
      const end = start + range;
    
      for (let i = start; i < end; i++) {
        for (let j = min; j < Math.sqrt(end); j++) {
          if (i !== j && i % j === 0) {
            isPrime = false;
            break;
          }
        }
        if (isPrime) {
          primes.push(i);
        }
        isPrime = true;
      }
    }
    
    if (isMainThread) {
      const max = 10_000_000;
      const threadCount = 8;
      const threads = new Set();
    
      const range = Math.ceil((max - min) / threadCount);
      let start = min;
      console.time("prime");
      for (let i = 0; i < threadCount - 1; i++) {
        const wStart = start;
        threads.add(
          new Worker(__filename, { workerData: { start: wStart, range } })
        );
        start += range;
      }
      threads.add(
        new Worker(__filename, {
          workerData: { start, range: range + ((max - min + 1) % threadCount) },
        })
      );
    
      for (let worker of threads) {
        // worker에서 에러가 났을 경우
        worker.on("error", (err) => {
          throw err(err);
        });
    
        worker.on("exit", () => {
          threads.delete(worker);
          if (threads.size === 0) {
            console.timeEnd("prime");
            console.log(primes.length);
          }
        });
    
        // worker들의 일을 합쳐준다.
        worker.on("message", (msg) => {
          primes = primes.concat(msg);
        });
      }
    } else {
      findPrimes(workerData.start, workerData.range);
      parentPort.postMessage(primes);
    }
    ```
    
    ![스크린샷 2023-07-30 오후 1.35.31.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.35.31.png)
    
- 워커 스레드를 많이 만든다고 비례해서 시간이 줄어드는 것은 아니다!
    - 워커 스레드 생성 시에도 시간이 걸린다
    - 메인 스레드 → 워커 스레드로 분배하는 시간도 걸린다
    - 컴퓨터 사양에 따라서도 달라진다

<aside>
💡 굳이 Node로는 멀티스레드를 생성하여 작업하지 않는 것을 추천!

</aside>

## child_process

```jsx
const exec = require("child_process").exec;

var process = exec("dir");

// 콘솔 창에서 dir 시 출력되는 결과 데이터
process.stdout.on("data", function (data) {
  console.log(data.toSting());
});

// 콘솔 창에서 dir 후 에러발생 시 결과 데이터
process.stderr.on("data", function (data) {
  console.error(data.toSting());
});
```

- 멀티 스레드는 다른 언어로 짜는 것이 좋기 때문에 child_process를 활용할 수 있다.
    
    ```jsx
    const spawn = require("child_process".spawn);
    
    // test.py 파일을 node를 통해서 실행할 수 있다(but, python이 컴퓨터에 깔려있어야 함)
    const process = spawn("python", ["test.py"]);
    ```
    

## 파일 시스템(fs)

- fs : 파일 시스템에 접근하는 모듈
    - 파일 or 폴더 `생성/삭제/읽기/쓰기` 가능
    - 웹 브라우저에서는 제한적이나 node에서는 권한이 있음
- 파일 읽기
    
    ```jsx
    const fs = require("fs");
    
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data); // 16진수 데이터
      console.log(data.toString()); // 사람이 읽을 수 있는 데이터
    });
    ```
    
    ```jsx
    // promise로 fs 활용하기
    const fs = require("fs").promises;
    
    fs.readFile("./readme.txt")
      .then((data) => {
        console.log(data); // 16진수 데이터
        console.log(data.toString()); // 사람이 읽을 수 있는 데이터
      })
      .catch((err) => {
        throw err;
      });
    ```
    
- 파일 쓰기
    
    ```jsx
    const fs = require("fs").promises;
    
    fs.writeFile("./writeme.txt", "글을 써주sayYo")
      .then(() => {
        return fs.readFile("./writeme.txt");
      })
      .then((data) => {
        console.log(data);
        console.log(data.toString());
      })
      .catch((err) => {});
    ```
    
    ![스크린샷 2023-07-30 오후 2.23.50.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_2.23.50.png)
    
- 비동기적으로 파일 읽기
    
    ```jsx
    const fs = require("fs");
    
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log("1번", data.toString()); // 사람이 읽을 수 있는 데이터
    });
    
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log("2번", data.toString()); // 사람이 읽을 수 있는 데이터
    });
    
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log("3번", data.toString()); // 사람이 읽을 수 있는 데이터
    });
    
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log("4번", data.toString()); // 사람이 읽을 수 있는 데이터
    });
    ```
    
    ![스크린샷 2023-07-30 오후 2.32.41.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_2.32.41.png)
    
- 동기적으로 파일 읽기
    - 매우 비효율적
    - 딱 한 번 작업하거나 서버 초기화할 때만 사용해야한다. 서버 사용 중에 호출될 경우 마지막으로 사용하는 사람이 너무 오래 걸릴 수 있다.
        
        ```jsx
        const fs = require("fs");
        
        let data = fs.readFileSync("./readme.txt");
        console.log("1번", data.toString());
        data = fs.readFileSync("./readme.txt");
        console.log("2번", data.toString());
        data = fs.readFileSync("./readme.txt");
        console.log("3번", data.toString());
        data = fs.readFileSync("./readme.txt");
        console.log("4번", data.toString());
        ```
        
        ![스크린샷 2023-07-30 오후 2.35.12.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_2.35.12.png)
        
- 비동기로 순서 지켜서 파일 읽기
    - 동시성도 살리고 순서도 지킬 수 있음!
        
        ```
        const fs = require("fs").promises;
        
        async function main() {
          let data = await fs.readFile("./readme.txt");
          console.log("1번", data.toString());
          data = await fs.readFile("./readme.txt");
          console.log("1번", data.toString());
          data = await fs.readFile("./readme.txt");
          console.log("1번", data.toString());
          data = await fs.readFile("./readme.txt");
          console.log("1번", data.toString());
        }
        
        main();
        ```
        

## Buffer / Stream

- `Buffer` : 일정한 크기로 모아두는 데이터
    - ex) 100mb 파일을 서버에서 100mb가 다 찰 때까지 기다린 후 전달
- `Stream` : 데이터의 흐름
    - ex) 100mb 파일을 1mb씩 전달한다
    - 대용량 파일을 보내려면 스트리밍 하는 것이 좋다.
    - 메모리 관리가 효율적이다.

![스크린샷 2023-07-30 오후 2.48.53.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_2.48.53.png)

### Buffer

- 파일을 buffer를 통해 읽기 위해서는 fs.readFile()을 활용할 수 있다.

### Stream

- readStream
    
    ```jsx
    const fs = require("fs");
    const readStream = fs.createReadStream("./readme-buffer.txt");
    
    const data = [];
    readStream.on("data", (chunk) => {
      data.push(chunk);
    
      console.log("data : ", chunk, chunk.length);
    });
    readStream.on("end", () => {
      console.log("end : ", Buffer.concat(data).toString());
    });
    readStream.on("error", () => {
      console.log("error : ", err);
    });
    ```
    
    ![스크린샷 2023-07-30 오후 3.01.32.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_3.01.32.png)
    
    - 위와 같이 결과가 나온 이유는, 한 번에 읽는 조각이 64kb이다보니 작은 파일은 한 번에 읽고 가져오기 때문에 마치 buffer와 같이 한꺼번에 가져온 것 같아 보인다.
    - `highWaterMark`를 활용하여 읽는 조각의 크기를 변경하면 stream이 읽어들이는 방식을 확인할 수 있음!
        
        ```jsx
        const readStream = fs.createReadStream("./readme-buffer.txt", {
          highWaterMark: 16,       // 16 byte
        });
        ```
        
        ![스크린샷 2023-07-30 오후 3.02.47.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_3.02.47.png)
        
- writeStream
    - writeStream 이벤트 : write, end, finish(이벤트 리스너)
        
        ```jsx
        const fs = require("fs");
        
        const writeStream = fs.createWriteStream("./writeme2.txt");
        // writeStream 이벤트 -> write, end, finish(이벤트 리스너)
        writeStream.on("finish", () => {
          console.log("파일 쓰기 완료");
        });
        
        // write()한개가 하나의 버퍼
        writeStream.write("이 글을 씁니다.\n");
        writeStream.write("한 번 더 씁니다.");
        writeStream.end();
        ```
        
        ![스크린샷 2023-07-30 오후 4.08.54.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_4.08.54.png)
        
        ![스크린샷 2023-07-30 오후 4.09.06.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_4.09.06.png)
        

## pipe와 스트림 메모리 효율 확인

### pipe

```jsx
const fs = require("fs");

const readStream = fs.createReadStream("./readme-buffer.txt", {
  highWaterMark: 16,
});
const writeStream = fs.createWriteStream("./write-buffer.txt");
readStream.pipe(writeStream);
```

- zlib를 통해 압축된 파일도 저장할 수 있다
    
    ```jsx
    const fs = require("fs");
    const zlib = require("zlib");
    
    const readStream = fs.createReadStream("./readme-buffer.txt", {
      highWaterMark: 16,
    });
    // 압축 스트림
    const zlibStream = zlib.createGzip();
    
    // 압축된 걸 저장한다
    const writeStream = fs.createWriteStream("./write-buffer.txt.gz");
    readStream.pipe(zlibStream).pipe(writeStream);
    ```
    
    - streaming을 하면 다양한 pipe끼리 연결할 수 있다. → stream에서만 pipe끼리의 연결 지원

### stream 메모리 효율 확인하기

- stream을 활용했을 때 훨신 효율이 좋은 것을 확인할 수 있음
- ex) 1GB의 big.txt 파일 읽고 쓰기
    - buffer
        
        ```jsx
        // buffer-memory.ts
        
        const fs = require("fs");
        
        console.log("before: ", process.memoryUsage().rss);
        
        const data = fs.readFileSync("./big.txt");
        fs.writeFileSync("./big2.txt", data);
        console.log("buffer: ", process.memoryUsage().rss);
        ```
        
        ![스크린샷 2023-07-30 오후 6.14.40.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_6.14.40.png)
        
    - stream
        
        ```jsx
        // stream-memory.ts
        
        const fs = require("fs");
        
        console.log("before: ", process.memoryUsage().rss);
        
        const readStream = fs.createReadStream("./big.txt");
        const writeStream = fs.createWriteStream("./big3.txt");
        readStream.pipe(writeStream);
        readStream.on("end", () => {
          console.log("buffer : ", process.memoryUsage().rss);
        });
        ```
        
        ![스크린샷 2023-07-30 오후 6.15.15.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_6.15.15.png)
        

### 기타 fs 메소드

- fileSystem 공식 문서 : [https://nodejs.org/dist/latest-v20.x/docs/api/fs.html](https://nodejs.org/dist/latest-v20.x/docs/api/fs.html)

```jsx
fs.access(경로, 옵션, 콜백);  // 폴더나 파일 접근 가능 여부 확인
fs.mkdir(경로, 콜백);        // 폴더 만들기
fs.open(경로, 옵션, 콜백);    // 파일 아이디 가져오기(파일이 없으면 새로 생성)
fs.rename(기존경로, 새 경로, 콜백);  // 파일명 변경하기
fs.readdir(경로, 콜백);      // 폴더 안 내용 확인(배열 안에 내부 파일 및 폴더명이 나온다)
fs.unlink(경로, 콜백);       // 파일 삭제
fs.rmdir(경로, 콜백);        // 폴더 삭제
fs.copyFile(기존경로, 새 경로);   // 파일 복사
fs.watch(경로, 콜백);           // 파일 감시(변경사항 발생 시 이벤트 호출)
fs.existsSync();           // 파일이나 폴더가 존재하는지 확인
fs.stat();                 // 파일인지 폴더인지 바로가기인지 확인할 수 있음
```

## 스레드풀과 커스텀 이벤트

### 스레드풀

- fs, crypto, zlib 모듈의 메소드 실행 시 백그라운드에서 동시에 실행된다(스레드풀이 동시에 처리)
- crypto같은 경우 4개씩 그룹지어 수행되는 것을 확인할 수 있음
    - UV_THREADPOOL_SIZE = 8 로 바꾸면 8개의 코어를 활용한다
    ⇒ 8개 전체가 그룹지어 수행된다.
    - 자기 컴퓨터 사양에 맞게 적절하게 조절하면 효율적으로 사용할 수 있다.
    
    ```jsx
    const crypto = require("crypto");
    
    const pass = "pass";
    const salt = "salt";
    const start = Date.now();
    
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("1", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("2", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("3", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("4", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("5", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("6", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("7", Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1_000_000, 128, "sha512", () => {
      console.log("8", Date.now() - start);
    });
    ```
    
    ![스크린샷 2023-07-30 오후 6.36.57.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB2%20%E1%84%82%E1%85%A9%E1%84%83%E1%85%B3%20%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%20%E1%84%8B%E1%85%B5%E1%86%A8%E1%84%92%E1%85%B5%E1%84%80%E1%85%B5%20fab16763337e4ee0b0543ff240c40f77/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-30_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_6.36.57.png)
    

### 커스텀 이벤트

- 이벤트를 등록하여 이벤트 실행 시 특정 동작 공유 가능

```jsx
const EventEmitter = require("events");

const myEvent = new EventEmitter();

// 이벤트 등록
myEvent.addListener("event1", () => {
  console.log("event1");
});
myEvent.on("event2", () => {
  console.log("event2");
});
myEvent.on("event2", () => {
  console.log("event2 added");
});

// 한 번만 실행되는 이벤트
myEvent.once("event3", () => {
  console.log("event3");
});

myEvent.emit("event1");
myEvent.emit("event2");
myEvent.emit("event3");
// event3은 한 번만 실행되는 이벤트 이므로 실행 안됌
myEvent.emit("event3");
```

```jsx
// 연결된 모든 이벤트 삭제
myEvent.on("event4", () => {
  console.log("event4");
});
myEvent.removeAllListeners("event4");
```

```jsx
// 한 개의 이벤트만 삭제
const listener = () => {
  console.log("event5");
};

myEvent.on("event5", listener);

// 삭제하기 위해서는 callback 함수를 넘겨줘야 함
myEvent.removeListener("event5", listener);

// 연결된 이벤트 개수
console.log(myEvent.listenerCount("event2"));
```

## 예외 처리

- 예외(Exception) : 처리하지 못한 에러
    - 노드 스레드 멈춤
- 예외 처리 (⭐️⭐️⭐️⭐️⭐️)
    - `try/catch 문`으로 예외 처리
    - 콜백 함수에서 `에러 객체 제공`
        
        ```jsx
        (err, data) => {
        	if(err) {
        		console.error(err)
        	}
        }
        ```
        
    - promise를 사용할 때는 반드시 `catch를 사용`한다
- 모든 코드를 try/catch 하기 어렵다면, 최후의 수단으로 process.on() 사용
    - 콜백 함수의 동작이 보장되지 않기 때문에 process.on() 안에는 에러 복구 코드를 적으면 안된다.
    - 에러 기록용으로만 사용할 것!
    
    <aside>
    💡 but, 에러가 있는 코드는 옳지 못한 코드이므로 반드시 고쳐야한다!
    
    </aside>
    
    ```jsx
    process.on('uncaughtException', (err) => {
    	console.error('예기치 못한 에러', err);
    });
    ```
    
- 프로세스 종료하기
    
    ```jsx
    // 포트 넘버 확인하기
    lsof -i tcl:포트
    // 혹은 node 내에서
    process.pid
    
    // 프로세스 종료하기
    kill -9 프로세스아이디
    ```