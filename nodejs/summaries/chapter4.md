# 섹션4. 패키지 매니저

진행상태: 완강
기간: August 5, 2023 → August 6, 2023

## package.json

### npm(Node Package Manager)

- 노드 패키지 매니저로 오픈 소스 생태계
- 다른 사람이 만들어놓은 코드를 `npm`을 통해서 설치할 수 있다
- 남의 코드를 사용하여 프로그래밍 가능
- 이미 편리하게 만들어놓은 서버 구조를 가져다가 쓰는 것이 훨씬 효율적이다
- npm에는 JavaScript 패키지가 굉장히 많다

### package.json

- 현재 프로젝트에 대한 정보와 사용중인 패키지에 대한 정보를 담은 파일
- Node product 시작 전 `package.json` 파일먼저 만들고 시작한다 (`npm init` 혹은 직접 json 파일 만들어도 된다)
    
    ![스크린샷 2023-08-06 오후 10.30.42.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB4%20%E1%84%91%E1%85%A2%E1%84%8F%E1%85%B5%E1%84%8C%E1%85%B5%20%E1%84%86%E1%85%A2%E1%84%82%E1%85%B5%E1%84%8C%E1%85%A5%2099ee8d5f221041b0989c63114b8abf8c/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_10.30.42.png)
    
    - `description` : 패키지 설명
    - `entry point` : JavaScript 실행 파일 진입점
    - `test command` : 코드 테스트 시 입력할 명령어
    - `git repository` : 코드를 저장해둔 git 저장소 주소
    - `license` : 패키지 라이센스. MIT(오픈소스), 자기 코드가 오픈소스가 되지 않았으면 한다면 다른 라이센스를 기입
    - `scripts` : 터미널에 치는 명령어들을 간단하게 별명을 붙여주었다
        
        ```jsx
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1",
          "start": "node index"
        },
        ```
        
        ```
        npm run test
        npm run start 혹은 npm start(너무 유명해서 run을 붙이지 않아도 실행된다)
        ```
        
    - `dependencies`
        - 실제 배포단계에서도 사용되는 패키지들
        
        ```
        npm i express
        npm i cookie-parser body-parser(여러개 동시에 설치 가능)
        ```
        
        ```json
        "dependencies": {
          "body-parser": "^1.20.2",
          "cookie-parser": "^1.4.6",
          "express": "^4.18.2"
        }
        ```
        
        - 버전을 정확하게 입력해야지 어떠한 환경이어도 동일한 버전으로 실행할 수 있다
        - 버전이 업그레이드 되면 기존에 사용하던 기능이 모두 정상적으로 동작한다는 보장이 없다
    - `devDependencies`
        - 개발할 때만 사용되는 패키지들
        
        ```json
        "devDependencies": {
          "nodemon": "^3.0.1"
        }
        ```
        

## node_modules / npx / SemVer

### node_modules / npx

- 다운받은 패키지들
- express를 설치한다면 express 프로젝트의 내부 dependencies들도 함께 받기 때문에 node_modules에 실제로 많은 패키지가 받아진다
- node_modules는 용량을 많이 차지하기 때문에 배포 시에는 지우고 배포한다
- package.json만 잘 가지고 설치(npm i)만 잘 해주면 된다
- 글로벌 패키지(전역 패키지)
    - `-g` 키워드 사용
    - 직접 명령어처럼 사용할 수 있다
        
        ```json
        // rimraf는 뭔가를 지울 수 있는 모듈
        npm i -g rimraf
        
        // node_modules 지우기
        rimraf node_modules
        ```
        
    - package.json에 설치 기록이 남지 않기 때문에 추후 유지보수하기 힘들어서 보통은 글로벌하게 설치하지 않는다.
    - 대신 글로벌하게 설치하지 않는다면, npx(Node Package Execute)를 활용하여 글로벌 명령어처럼 실행할 수 있다
        
        ```json
        npx rimraf node_modules
        ```
        
- package-lock.json
    - 버전을 상세하게 기입해놓은 json 파일
    - package.json은 종종 변경될 가능성이 있음
- node의 버전
    
    <aside>
    💡 항상 버전은 명확하게 기입하자!
    
    </aside>
    
    - 노드는 배포할 때 항상 버전을 올려야 한다
    - 패키지의 버전을 세 자리로 만든다 → SemVer 버저닝(유의적 버저닝)
    - Major(주 버전), Minor(부 버전), Patch(수 버전)
        
        ![스크린샷 2023-08-06 오후 10.52.58.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB4%20%E1%84%91%E1%85%A2%E1%84%8F%E1%85%B5%E1%84%8C%E1%85%B5%20%E1%84%86%E1%85%A2%E1%84%82%E1%85%B5%E1%84%8C%E1%85%A5%2099ee8d5f221041b0989c63114b8abf8c/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_10.52.58.png)
        
        - `Major` : 대대적인 수정이 있다는 이야기로 기존 코드가 돌아가지 않는다는 것을 알린다
        - `Minor` : 수정은 발생하였지만 기존 코드 사용자가 안심하고 버전을 올려도 된다
        - `Patch` : 정말 자잘한 버그 수정
    - 버전 기호
        - `^` : Major 자리만 무조건 일치하고 나머지 Minor나 Patch 자리는 신경쓰지 않겠다
        - `~` : Minor 자리까지만 무조건 일치하고 Patch는 신경쓰지 않겠다 → 하지만 사실상 기존 코드와 호환이 되는 경우라서 사실상 의미 없음
        - `아무 기호가 없는 경우` : 세 번째 Patch까지 모두 고정으로 사용한다
        - `≥, ≤, >, <` : 이상, 이하, 초과, 미만 으로도 표현 가능 → 거의 사용하지 않음
        - `@latest` : 최신 버전
        - `@next` : 가장 최신 배포판(불안정함)
        - `알파, 베타, RC` : 한정되어있는 버전의 숫자들을 활용하기 위해 추가로 붙여줄 수 있다(1.1.1-alpha.0, 2.0.0-beta.1, 2.0.0-rc.0)
        
        ```json
        npm i express@latest  // 최신 버전 설치
        npm i express@3
        npm i express@3.1.2
        npm i express@next    // 정식 출시는 안됐지만 앞으로 나올 버전을 미리 테스트해볼 수 있다
        ```
        

## npm 명령어들

[https://docs.npmjs.com/cli/v9](https://docs.npmjs.com/cli/v9)

```json
npm outdated      // 어떤 패키지에 기능 변화가 있는 지 알 수 있다
npm uninstall     // 패키지 삭제
npm search 검색어   //npm 패키지 검색(npmjs에서 검색하는 것과 동일함)
npm info 패키지명   // 패키지 세부 정보 파악
npm adduser       // npm 로그인을 위한 명령어
npm whoami        // 현재 사용자가 누구인지 알려줌
npm logout        // 로그인한 계정 로그아웃
npm version 버전   // package.json 버전을 올린다(git commit까지 같이 된다)
npm deprecate [패키지명][버전][메시지]  // 1.0.0 버전을 deprecated한다면 해당 패키지 설치 시 경고 메시지를 띄우게 한다
npm publish       // 자신이 만든 패키지 배포
npm unpublish     // 자신이 만든 패키지 배포 중단(배포 후 72시간 내에만 가능, 다른 사람이 사용하고 있을 수 있기 때문에)
npm ls            // 내 프로젝트에서 어떤 패키지 사용하고 있는지 볼 때 사용
```

- npm info express
    
    ![스크린샷 2023-08-06 오후 11.07.46.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB4%20%E1%84%91%E1%85%A2%E1%84%8F%E1%85%B5%E1%84%8C%E1%85%B5%20%E1%84%86%E1%85%A2%E1%84%82%E1%85%B5%E1%84%8C%E1%85%A5%2099ee8d5f221041b0989c63114b8abf8c/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_11.07.46.png)
    
    - 만약 `npm i express@next` 하면 5.0.0-beta.1 버전이 설치된다
- npm version 버전
    
    ```json
    "packages": {
        "": {
          "name": "npmtest",
          "version": "1.0.0",  // 이 버전!
    			...
    		}
    }
    
    npm version major
    npm version minor
    npm version patch
    ```
    
- npm unpublish
    
    ```json
    npm unpublish --force
    ```
    
    - 삭제한 후 info로 다시 검색하면 아래와 같이 404 에러가 뜸
        
        ![스크린샷 2023-08-06 오후 11.26.40.png](%E1%84%89%E1%85%A6%E1%86%A8%E1%84%89%E1%85%A7%E1%86%AB4%20%E1%84%91%E1%85%A2%E1%84%8F%E1%85%B5%E1%84%8C%E1%85%B5%20%E1%84%86%E1%85%A2%E1%84%82%E1%85%B5%E1%84%8C%E1%85%A5%2099ee8d5f221041b0989c63114b8abf8c/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-08-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_11.26.40.png)