# 👨‍👩‍👧‍👦 링고: 화상 수업, 그 이상의 연결

**링고(RINGO)**는 고수의 노하우와 제자의 열정을  
**실시간으로 이어주는 맞춤형 교육 플랫폼**입니다.  
사용자는 쉽게 **고수**가 될 수도, **제자**가 될 수도 있습니다.

---

## ✨ 주요 기능

- ✅ 회원가입 / 로그인  
- 📝 커뮤니티 작성 / 수정 / 삭제 / 목록 조회  
- 🔍 WebRTC 기반 P2P 화상 연결  
- 💬 실시간 1:1 채팅 (Socket.io)  
- 🖌️ 도형, 선, 자유 그리기 기능 (fabric.js)  
- 🤖 LLM(OpenAI)을 활용한 실시간 요약 정리  

---

## 🛠 사용 기술

### 🔸 Backend
- Node.js
- Express
- Spring Security
- WebRTC
- Socket.io (실시간 채팅)
- express-validator (입력 유효성 검사)
- OpenAI (요약 기능)

---

## 📁 폴더 구조

```bash
project/
├── server.js # Node 기반 WebSocket 서버
├── build/ # 프론트엔드 빌드 결과물
├── node_modules/ # Node.js 의존성 모듈
├── public/ # 정적 자원 폴더
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/example/ringo/
│ │ │ ├── command/
│ │ │ ├── community/
│ │ │ ├── config/
│ │ │ ├── controller/
│ │ │ ├── lecture/
│ │ │ ├── mypage/
│ │ │ ├── notice/
│ │ │ ├── qna/
│ │ │ ├── room/
│ │ │ ├── users/
│ │ │ ├── util/
│ │ │ └── RingoApplication.java # Spring Boot 진입점
│ │ ├── react/
│ │ │ ├── components/ # 공통 컴포넌트
│ │ │ └── pages/ # 주요 화면 구성
│ │ │ ├── community/
│ │ │ ├── IdFind/
│ │ │ ├── LectureInfo/
│ │ │ ├── Login/
│ │ │ ├── main/
│ │ │ ├── MyPage/
│ │ │ ├── Notice/
│ │ │ ├── Product/
│ │ │ ├── pwChange/
│ │ │ ├── Qna/
│ │ │ ├── SignUp/
│ │ │ ├── UserInfo/
│ │ │ └── WebRTC/
│ │ ├── socket.js # Socket.io 관련 통신 로직
│ │ ├── Main.js # 프론트 진입점 또는 라우터 설정
│ │ └── User.js # 사용자 관련 기능
│ └── test/ # 테스트 코드
├── gradle/ # Gradle Wrapper 설정
├── build.gradle # 빌드 설정 파일
├── settings.gradle # 프로젝트 설정 파일
├── package.json # Node 의존성 및 실행 스크립트
└── 기타 설정 파일들 (.idea, .git 등)

## 🚀 실행 방법

```bash
npm install
npm run dev
npm run watch
