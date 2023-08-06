# 섹션 1. 알아두어야 할 자바스크립트

진행상태: 완강
기간: July 15, 2023 → July 22, 2023

## 호출 스택

### 동기 코드

```jsx
function first() {
	second();
	console.log('첫 번째');
}
function second() {
	second();
	console.log('두 번째');
}
function third() {
	second();
	console.log('세 번째');
}
first();
```

![IMG_A3C2708EC1D5-1.jpeg](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%201%20%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%8B%E1%85%A1%E1%84%83%E1%85%AE%E1%84%8B%E1%85%A5%E1%84%8B%E1%85%A3%20%E1%84%92%E1%85%A1%E1%86%AF%20%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%20bab1eaf1ad7944a3af17923e407bc723/IMG_A3C2708EC1D5-1.jpeg)

- 호출 순서 : 세 번째 → 두 번째 → 첫 번째
- 파일이 실행될 때 anonymous 가 하나 쌓이고 이후에 실행되는 함수가 스택에 쌓인다.
- 파일이 끝나면 anonymous도 사라진다.
- anonymous는 크롬에서 나오는 단어!
- 호출 스택이 비었다 → JS 파일 실행 완료

### 비동기 코드

- 아래 구조를 잘 기억하기
    
    ![스크린샷 2023-07-22 오후 12.08.51.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%201%20%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%8B%E1%85%A1%E1%84%83%E1%85%AE%E1%84%8B%E1%85%A5%E1%84%8B%E1%85%A3%20%E1%84%92%E1%85%A1%E1%86%AF%20%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%20bab1eaf1ad7944a3af17923e407bc723/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-22_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_12.08.51.png)
    

```jsx
function run() {
	console.log('3초 후 실행');
}
console.log('시작');
setTimeout(run, 3000);
console.log('끝');
```

- setTimeout 같은 비동기 함수는 백그라운드에 넣어준다.
- 백그라운드로 넘어가면 코드가 동시에 실행된다. (3초 실행 중)
- 백그라운드가 먼저 끝나더라도 항상 호출 스택이 먼저 처리되어야 한다!
- setTimeout의 이동
    - 백그라운드 → 태스크 큐로 run 이동 → 호출스택으로 run 이동 → console.log() 호출 스택 쌓임 → 3초 후 실행 출력 → 호출스택에서 아웃
- 호출 스택, 백그라운드, 태스크 큐가 다 비어있다 ⇒ 자바 스크립트 실행 완료! ⇒ 이벤트 루프!!
- 백그라운드는 다른 스레드가 실행한다. 따라서 호출 스택 & 백그라운드가 돌면 멀티 스레드다.
- Node에서 백그라운드로 넘어갈 수 있는 함수를 제한해놨다
ex) setTimeout, setInterval, 네트워크 요청, 하드디스크 파일 읽는 명령, crypto 명령 등..
- 동시에 실행될 수 있는 코드는 제한이 있고 나머지 코드들은 모두 다 동기적으로 돌아간다
- Promise는 내부까지는 동기. then을 만나는 순간 비동기로 간다.
- 백그라운드에 함수가 여러개 있으면 누가 먼저 끝날 지 모른다.
    - 타이머보다 Promise가 먼저 호출 스택으로 이동한다! 우선순위가 Promise가 더 높음.
    - Promise의 then 쪽이 새치기를 한다!
    - 아래 2개는 우선순위가 높아서 먼저 호출 스택으로 이동한다
        - Promise. then / catch
        - process.nextTick
- 백그라운드에서 어떻게 동시에 실행되지? → C++로 되어있다. 아니면 운영체제 쪽이라서 백그라운드와 태스크 큐는 사실 상 자바스크립트 아님. 호출 스택만 자바스크립트임.
- 노드는 싱글스레드이다! 다른 언어로 되어있어서 동시성이 있는거지 자바스크립트 자체에서는 없다

## var, const, let

- 세 선언문의 차이점 : 지원하는 스코프가 다르다!

### var

- 함수 스코프
- 값 재할당 가능

```jsx
// var
function a(){
	var y = 3;
}
console.log(y);  // 에러(함수 스코프 벗어남)
```

### const

- 블록 스코프
- 값 재할당은 안됨!
- 대신 객체 형태일 경우 객체 내부의 필드는 재할당 가능

```jsx
// const
if(true){
	const x = 3;
}
console.log(x);  // 에러(블록 스코프 벗어남)

const fruit = 'apple';
fruit = 'banana';    // 에러(값의 재할당 불가)

const fruit = {
	name: 'apple';
}
fruit.name = 'banana';  // OK
```

### let

- 블록 스코프
- 값 재할당 가능

```jsx
// let
if(true){
	let x = 5;
}
console.log(x);  // 에러(블록 스코프 벗어남)
```

## 템플릿 문자열, 객체 리터럴

### 템플릿 문자열 or 백틱 문자열

```jsx
var won = 10000;
var result = '이 과자는 ' + won + '원입니다.';

const result = `이 과자는 ${won}원입니다.`;    // 템플릿 문자열 or 백틱 문자열
```

### 태그드 템플릿 리터럴

```jsx
function a() {}
a();
a``;     // 이런 식으로 함수를 호출할 수도 있음! -> 태그드 템플릿 리터럴
```

### 객체 리터럴

- 간결한 문법으로 객체 리터럴 표현이 가능해졌다 → 타자 수가 줄어들음

```jsx
var sayNode = function() {
	console.log('Node');
}

// before(ES5)
var oldObject = {
	sayJS: function(){
		console.log('JS');
	}
	sayNode: sayNode,
}
oldObject[es + 6] = 'Fantastic';  // 동적속성
```

```jsx
// after(ES6)
var olbObject = {
	sayJS() {                       // function() 구문을 뺄 수 있다
		console.log('JS');
	},
	sayNode,                        // key와 value가 동일하다면 하나로 합칠 수 있다
	[es + 6]: 'Fantastic';          // 객체 안에 동적 속성을 넣을 수 있다
}
```

## 화살표 함수

- 간결한 문법으로 함수 구현 가능
- 화살표함수가 무조건 function을 대체하는 것은 아니다! → function을 써야할 때가 있음

```jsx
/* ex 1 */
// function
function add(x, y) {
	return x + y;
}

// arrow function
const add = (x, y) => {
	return x + y;
}

const add = (x, y) => x + y;
const add = (x, y) => (x + y);

/* ex 2 */
// function
function not(x) {
	return !x;
}

// arrow function
const not = x => !x;       // 매개변수가 1개인 경우 괄호 생략 가능!
```

- 객체를 return 하는 경우 괄호를 사용한다

```jsx
const obj = (x, y) => ({x, y});
```

- 기존 function을 활용해야하는 이유 ⇒ `this` 때문!
    - function → 자기만의 this를 가진다.
    - arrow function → 부모의 this를 가진다.
    
    ```jsx
    // function
    var relationship = {
      name: "jane",
      friends: ["peny", "mikael", "annie"],
      myFriends: function () {
        const that = this;
        this.friends.forEach(function (friend) {
          console.log(that.name, friend);     // that을 통해 호출. 만약에 this.name으로 코드를 수정하면 undefined가 출력됨
        });
      },
    };
    
    relationship.myFriends();
    ```
    
    ```jsx
    // arrow function
    var relationship = {
      name: "jane",
      friends: ["peny", "mikael", "annie"],
      myFriends: function () {
        this.friends.forEach((friend) => {
          console.log(this.name, friend);      // 부모 function 의 this를 물려받아서 this.name으로 호출 가능
        });
      },
    };
    
    relationship.myFriends();
    ```
    
    <aside>
    💡 this를 사용해야 한다 ⇒ function 사용
    this를 사용하지 않는다 ⇒ arrow function 사용
    
    왠만하면 this를 사용하지 않는다!
    
    </aside>
    

## 구조분해할당

- 객체
    - key값이 일치해야한다.
        
        ```jsx
        const example = {
        	a: 123,
        	b: {
        		c: 456,
        		d: 789,
        	}
        }
        
        const = {a, b: {d}} = example;
        console.log(a);  // 123
        console.log(d);  // 789
        
        console.log(b);  // b의 경우 undefined라고 뜸
        ```
        
- 배열
    - 배열의 경우에는 배열 자리가 일치해야 한다
        
        ```jsx
        const arr = [1, 2, 3, 4, 5];
        
        const [x, y, , , z] = arr;
        console.log(x);   // 1
        console.log(z);   // 5
        ```
        
- 주의할 점
    - 객체 내에 this를 사용하고 있는 함수가 있다면 구조분해할당 시 문제가 된다.
    - this는 함수를 호출할 때 어떻게 호출되었냐에 따라 결정되기 때문
    - 따라서 this가 있을 경우에는 구조분해할당을 안하는 것이 좋다!

## 클래스

- 프로토타입 문법보다 그룹이 더 지어져서 깔끔해졌다
- 클래스명은 파스칼케이스로 작성한다!

## Promise, async/await

### Promise

- 콜백 지옥 / 프로미스 지옥 을 벗어날 수 있음
    - 콜백지옥
        
        ![콜백지옥.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%201%20%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%8B%E1%85%A1%E1%84%83%E1%85%AE%E1%84%8B%E1%85%A5%E1%84%8B%E1%85%A3%20%E1%84%92%E1%85%A1%E1%86%AF%20%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%20bab1eaf1ad7944a3af17923e407bc723/%25E1%2584%258F%25E1%2585%25A9%25E1%2586%25AF%25E1%2584%2587%25E1%2585%25A2%25E1%2586%25A8%25E1%2584%258C%25E1%2585%25B5%25E1%2584%258B%25E1%2585%25A9%25E1%2586%25A8.png)
        
    - 프로미스 지옥(feat.then)
        
        ![스크린샷 2023-07-22 오전 10.28.51.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB%201%20%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%8B%E1%85%A1%E1%84%83%E1%85%AE%E1%84%8B%E1%85%A5%E1%84%8B%E1%85%A3%20%E1%84%92%E1%85%A1%E1%86%AF%20%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%20bab1eaf1ad7944a3af17923e407bc723/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-07-22_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%258C%25E1%2585%25A5%25E1%2586%25AB_10.28.51.png)
        
- 내용이 실행은 되었지만 결과를 아직 반환하지 않은 객체
- `then`을 붙이면 결과를 반환함
- 실행이 완료되지 않았으면 완료된 후에 then 내부 함수가 실행됨
- 코드를 분리할 수도 있다
    
    ```jsx
    // promise를 먼저 실행
    const promise = setTimeoutPromise(3000);
    
    console.log('hello');
    console.log('hello');
    
    promise.then(() => {
    	// 나중에 promise를 꺼내서 활용
    })
    ```
    
- Promise 종류
    - `Promise.resolve(성공 리턴값)` : 바로 resolve하는 프로미스
    - `Promise.reject(실패 리턴값)` : 바로 reject하는 프로미스
    - `Promise.all(배열)` : 여러 개의 프로미스를 동시에 실행. 하나라도 실패하면 catch로 감.
    - `Promise.allSettled(배열)` : 여러 개의 프로미스를 동시에 실행. 실패한 것만 추려낼 수 있음.
    
    ```jsx
    // resolve(성공), reject(실패)
    const promise1 = Promise.resolve("성공 1");
    const promise2 = Promise.resolve("성공 2");
    const promise3 = Promise.reject("실패 1");
    
    // Promise all
    Promise.all([promise1, promise2, promise3])
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.error(e);
      });
    
    // Promise allSettled
    Promise.allSettled([promise1, promise2, promise3])
      .then((result) => {
        console.log(result);
      })
      .catch((e) => {
        console.error(e);
      });
    ```
    

### async / await

- Promise의 성질을 가지고 있어 항상 Promise를 반환한다.
- but, Promise처럼 then/catch 구문을 사용할 수 없다보니 try/catch 구문으로 감싸줘야한다!
- 실행순서 : 오른쪽 → 왼쪽

```jsx
async function findOneAndSaveUser(Users, userId) {
	let user = await Users.findOne({id: userId});
	user.name = 'jane';
	user = await user.save();
	user = await Users.findOne({gender: 'f'});
  // ...
}

async function main() {
	try{
		const result = await promise;
		return result;
	} catch(e) {
		console.error(e);
	}
}
```

- 참고
    - 요즘에는 Promise를 async 없이 await으로만 수행할 수도 있음!
        
        ```jsx
        const promise = new Promise(...)
        promise.then((result) => ...)
        
        // 1번 방법 - await로만 수행
        const result = await promise;
        
        // 2번 방법 - 불안할 경우 붙여줘도 된다
        async function main() {
        	const result = await promise;
        	return result;
        }
        
        // main을 호출하는 쪽에서는 then이나 await으로 받아줘야한다.
        main().then((name) => ...)
        const name = await main();
        ```
        
- for await of 구문
    - for  await  (변수 of 프로미스 배열)
    - await이 then이다보니 promise 배열을 반복문을 돌릴 수 있다!
    
    ```jsx
    const promise1 = Promise.resolve("성공 1");
    const promise2 = Promise.resolve("성공 2");
    
    (async () => {
    	for await (promise of [promise1, promise2]) {
    		console.log(promise);
    	}
    })()
    ```
    

## Map / Set

### Map

- 객체와 유사하게 `key, value` 형태로 묶여 있다.
- `key`를 통해 `value`에 접근이 가능하다.

```jsx
const m = new Map();
m.set('a', 'b');
m.set('c', 'd');
m.get('a');      // 'b'

const obj = {key: 'value'}
m.set(obj, 123);
m.get(obj);      //123
m.get({key: 'value'});   //undefined -> obj와 {key: 'value'}는 다른 값이다! 같은 참조 값으로만 검색 가능

// Map 사이즈
m.size;

// Map 반복문 돌리기
for(const [k, v] of m) {
	console.log(k, v);
}

// forEach도 가능!
m.forEach((v, k) => {
	console.log(v, k);
)

// key로 존재여부 확인
m.has(obj);

// key로 속성 삭제
m.delete(obj);

// 속성 전부 제거
m.clear();
```

### Set

- 중복을 허용하지 않는 배열
- 자료형이 다른 값도 저장할 수 있다
- 중복이 없어야 하는 배열 or 기존 배열에서 중복을 제거하고 싶을 때 활용하면 good!

```jsx
const s = new Set();
s.add(1);
s.add(2);
s.add(3);
s.add(3);      // 중복 값이기 때문에 저장은 되지만 데이터가 늘어나지 않음

// Set 사이즈
s.size;

// Set 반복문 돌리기
for(const a of s) {
	console.log(a);
}

// forEach도 가능
s.forEach((a) => {
	console.log(a);
)

// key로 존재여부 확인
s.has(1);

// key로 속성 삭제
s.delete(1);

// 속성 전부 제거
s.clear();

```

```jsx
// 배열의 중복을 제거하기
const arr = [1, 2, 3, 3, 4, 5, 5];

const s = new Set(arr);        // set(5) [1, 2, 3, 4, 5]
const result = Array.from(s);  
console.log(result);           // [1, 2, 3, 4, 5]
```

### WeakMap

- 가비지 컬렉팅이 된다 ⇒ 메모리 정리가 빠르게 된다

```jsx
// WeakMap
let wm = new Weakmap();

const obj3 = {};
wm.set(obj3, '123');

obj3 = null;  // 가비지 컬렉팅됨

// Map
let obj4 = {};
m.set(obj, '123')
obj4 = null;  // 메모리에 쌓여있어서 가비지 컬렉팅이 안됌. Map을 지우기 전까지는 살아있음.
```

```jsx
let user = {name: 'annie', age: 27};
user.married = false;

const userObj = {
	user,
	married: false,
}

// 위 코드 개선
let wm = new Weakmap();
wm.set(user, {married: false});     // 객체를 수정하지 않으면서 부가적인 정보를 추가한다.
user = null;     // 가비지 컬렉팅되면 {married: false} 데이터도 날아간다.
```

### WeakSet

- 가비지 컬렉팅이 안됌.

## 널 병합 / 옵셔널 체이닝

### 널 병합 (??)

- or (||) 연산자 대용으로 사용한다
- `falsy` 값(0, ‘’, false, NaN, null, undefine) 중 **null과 undefined 만 따로 구분**한다.
- `falsy` 값이면 뒤로 넘어간다.
    
    ```jsx
    const a = 0;
    const b = a || 3;  // 앞의 값이 falsy이면 뒤로 넘어감
    console.log(b);    // 3 
    
    const c = 0;
    const d = c ?? 3;  // 앞의 값이 null이나 undefined일 때만 뒤로 넘어감
    console.log(d);    // 0
    
    const e = null;
    const f = e ?? 3;  // 앞의 값이 null이나 undefined일 때만 뒤로 넘어감
    console.log(f);    // 3
    ```
    

### 옵셔널 체이닝 (?)

- 값이 없다면 없는대로 두고 값이 있다면 그 안에서 읽는다.
- `?.` 은 한 세트라고 보면 된다.
    
    ```jsx
    c?.d;
    c?.f();
    
    c?.[0];
    ```
    
- 널 병합과 함께쓰면 좋다!
    
    ```jsx
    c?.[0] ?? '123';   // 앞의 값이 없을 경우 뒤로 넘어간다
    ```