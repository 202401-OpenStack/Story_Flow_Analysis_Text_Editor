# Story_Flow_Analysis_Text_Editor

## 1. 개발 환경
### 프론트엔드
1. Runtime Environment: Node >= v20.9.0
2. Frontend Library: React v18.2.0
3. State Management Library: react-redux ^9.1.0, @reduxjs/toolkit ^2.2.3, redux-thunk ^3.1.0
4. Editor Library: react-quill ^2.0.0
5. CSS Library: styled-components ^6.1.8
6. Other middlewares: axios ^1.6.8, bootstrap ^5.3.3, dom-to-image ^2.6.0, react-chrono ^2.6.1, react-force-graph-2d ^1.25.5, react-pro-sidebar ^1.1.0,
   
### 백엔드
1. Runtime Environment: Node >= v20.9.0
2. Backend Framework: express ^4.19.2
3. Database Server: MySQL
4. Database Middleware: mysql2 ^3.9.3
5. ORM Middleware: sequelize ^6.37.2, sequelize-cli ^6.6.2
6. Session Management Middleware: cookie-parser ^1.4.6, express-mysql-session ^3.0.0, express-session ^1.18.0
7. Encryption Middleware: bcrypt ^5.1.1
8. Other middlewares: axios ^1.6.8, body-parser ^1.20.2, cors ^2.8.5, dotenv ^16.4.5

## 2. 브랜치
1. 프론트엔드 최종 배포: frontend
2. 백엔드 최종 배포: development
3. 그 외
   - backend 브랜치: 백엔드 부분 데모 (이후 배포 문제로 아예 development로 옮김)
   - feature/redux: Redux 적용 (frontend로부터 분기)
   - feature/editor: Quill Editor 설정 관련 (frontend로부터 분기)

## 3. 코드 실행 방법
1. 프론트엔드
   - 코드 다운로드
   - npm install
   - npm start (API 호출 부분은 실행 안 될 수 있음)
2. 백엔드
   - 코드 다운로드
   - npm install
   - MySQL에 story_flow_analysis_text_editor 데이터베이스 생성
   - npx sequelize db:migrate --env development 명령어 실행 (마이그레이션 과정)
   - nodemon server.js (만약 안된다면 node server.js)

## 3. 홈페이지 사용 가이드
### 1. 도메인 진입
로그인/회원가입 중 고를 수 있음
### 2. 회원가입 클릭 후 회원가입 진행
- ID는 알파벳으로 시작하며, 최소 5글자 이상이어야 함
- 비밀번호는 적어도 1개의 대문자, 소문자, 그리고 숫자를 포함한 8글자 이상이어야 함
- 비밀번호 란과 비밀번호 확인 란에 적은 내용은 일치해야 함
- ID, 비밀번호, 비밀번호 확인 중 하나라도 제대로 입력하지 않았다면 서버에 정보가 제출되지 않음
### 3. 로그인 페이지로 넘어가서 가입한 계정으로 로그인
- 올바른 ID와 비밀번호를 입력하지 않으면 다음 단계로 넘어가지 않음
### 4. 로그인하면 /post-list 페이지로 진입 가능
- 로그아웃하기 전까진 /, /login으로 재진입 불가능
- 우측 상단의 로그아웃 버튼을 클릭하여 로그아웃 가능
- 하단의 + 를 클릭하여 새 글 작성 가능함
### 5. 4에서 + 를 클릭하여 /post-write 페이지로 진입하고, 여기서 글 작성 가능
- 
### 6. AI 기능 사용: 소설 작성 후 /(슬래시)를 눌러 드롭다운 표시
7. 사용할 기능 클릭
8. 1) <<요약하기/주제 찾기/키워드 추출/인물 수 분석/이야기 흐름 판단 中 선택>> 에디터 하단에 분석 결과가 텍스트로 삽입됨
   2) <<인물 관계 분석/타임라인 분석 中 선택>> 에디터 하단에 분석 결과가 이미지로 삽입됨
9. 저장 버튼을 눌러 저장 가능. 그러나 1분마다 자동저장이 되고, 에디터 페이지에서 나가면 자동으로 저장되므로 꼭 누르지는 않아도 됨
10. /post-list로 돌아온 후, 작성한 글의 제목을 클릭하면 아까 작성했던 글 세부 내용 조회 가능
11. 9번에서 '수정' 버튼을 눌러 글 수정 가능
12. /post-list의 헤더나 /post-write의 사이드바 등에 있는 '로그아웃' 버튼을 눌러 로그아웃 시 /login으로 리다이렉트됨
