# EZ_Chat2_crypto
> 이 프로젝트는 사용자가 암호화된 메시지로 채팅방에서 통신할 수 있도록 하는 보안 메시징 웹 애플리케이션

## 요약
- ID와 PW로 사용자인증.
- 유저가 지정한 입장번호로 보안성 강화.
- AES-GCM을 사용하여 암호화된 메시징.
- WebSocket을 지원하는 실시간 메시징.
------
## 설치

1. 설치:
    > .zip 설치도 가능
   ```
   cd 설치경로
   ```
   ```
   git clone https://github.com/kimsehyun-34/EZ_Chat2_crypto.git
   ```

2. npm 설치:
   ```
   npm install
   ```
## 사용법
1. `/db/user.json`수정 (로그인 정보수정, 회원가입 시스템 없음)
2. 서버실행:
   ```
   node index.js
   ```

- 3-1(서버유저). `http://localhost:8081/` 접속 (8081포트 사용시 수정)
- 3-2(일반유저). 호스트서버의 IPv4주소:8081 접속 `(ex: 192.168.0.1:8080)`
