# backend

## 1. 기술 스택
1. Node.js
2. MySQL
3. OpenAI API (추후 클라우드가 결정됨에 따라 변경될 수 있음)

## 2. 개발 내역
- 240325~240328 Node.js 공부
- 240329 express-mysql-session로 세션 구현
- 240329 MVC 패턴 구성
- 240329 DB 연동

## 3. 개발 상세
### 세션 관리
- 로그인 상태를 확인하기 위해 필요
- express-mysql-session 미들웨어 사용하여 세션 정보 저장
- 이후 세션의 로그인 정보 유무로 API 접근 허가 등의 조치를 할 수 있음
![image](https://github.com/ahnl1297/Story_Flow_Analysis_Text_Editor/assets/76491203/d51dca34-4fec-4c48-8670-932bb533949a)
- 세션이 유지된 경우에만 에디터 페이지에 진입 가능

### 화면 전환
- 로그인에 성공하면 /로 리다이렉트
![image](https://github.com/ahnl1297/Story_Flow_Analysis_Text_Editor/assets/76491203/51de6caa-011b-4f12-aed1-31471fde3751)
![image](https://github.com/ahnl1297/Story_Flow_Analysis_Text_Editor/assets/76491203/a674ae97-888c-436e-8191-cf635763a864)

### MVC 패턴 구성
- models, controllers, routes(=view)로 디렉토리를 구별하여 코드의 유지보수를 편리하게 함
![image](https://github.com/ahnl1297/Story_Flow_Analysis_Text_Editor/assets/76491203/1e8525e4-b74b-422d-a97d-9b52198cb44b)

### DB 연동
- Sequelize ORM으로 관리
- 회원가입 버튼을 누르면 Users 테이블에 폼에 작성된 데이터가 저장됨 (비밀번호는 해싱 함수 적용)
- 로그인 버튼을 누르면 데이터 조회 후 일치하는 유저 정보가 있을 시 메인 페이지로 접근할 수 있게 함
