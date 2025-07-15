# 👨‍👩‍👧‍👦 링고: 화상 수업, 그 이상의 연결

**링고**는 고수의 노하우와 제자의 열정을  
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

## 🧑‍💻 나의 역할

- **수업 방 생성 기능 구현**
  - 사용자가 이미지, 제목, 설명, 가격을 입력해 수업 방을 만들 수 있도록 UI 및 백엔드 처리 구현
  - 생성된 수업 방 정보를 새로고침 없이 바로 카드 목록에 반영

- **WebRTC 기반 실시간 화상 연결**
  - 방에 입장한 사용자 간의 1:1 P2P 연결 설정 및 해제 처리
  - 상대방의 연결 상태에 따라 비디오 스트림 제어

- **WebSocket을 활용한 실시간 협업 기능 개발**
  - 실시간 코드 공유 및 채팅 기능 구현
  - Fabric.js를 활용한 화이트보드 (선, 도형, 자유 그리기 등) 동기화 처리

- **음성 인식 및 요약 기능 구현 (STT + LLM)**
  - 사용자의 음성을 Whisper로 텍스트로 변환 (STT)
  - 변환된 내용을 OpenAI API로 요약 후 화면에 실시간 출력

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
## 🖥️ 실행 화면
<img src="https://private-user-images.githubusercontent.com/219836557/466429151-d2ba1ede-8b2e-4ae0-8940-b35000eb794a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTI1NzM5NTQsIm5iZiI6MTc1MjU3MzY1NCwicGF0aCI6Ii8yMTk4MzY1NTcvNDY2NDI5MTUxLWQyYmExZWRlLThiMmUtNGFlMC04OTQwLWIzNTAwMGViNzk0YS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNzE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDcxNVQxMDAwNTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lZmNmZjdjZTc0NWE2NDMxMzZiNjBmMzZlYzkyNGU1OTcwOWE1MmMxNmY5MDAwM2Q5MWMwYzJmM2IzMGRjNTc3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.AsFcU9MP146-mQCtg_Ot8wSWV2a3CXjVSkcpa-G7Qec" alt="">

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

```
## 🚀 실행 방법

```bash
npm install

npm run dev

npm run watch

```
---

### 🫠 프로젝트를 통해 느낀 점
이번 프로젝트에서는 단순한 로그인 기능을 넘어, **실시간 연결과 협업 기능**이라는 처음 다뤄보는 영역에 도전했습니다.  
처음에는 WebRTC나 WebSocket 같은 기술이 낯설어 구현에 어려움도 있었지만,  
시그널링 구조나 브라우저 간 P2P 연결 원리를 하나씩 이해해가면서 점차 감을 잡을 수 있었습니다.

특히 WebRTC를 활용해 사용자가 직접 수업 방을 만들고, 실시간으로 화상 연결이 되도록 구현했을 때  
브라우저만으로도 이런 실시간 기능이 가능하다는 점이 신기했고, 동작하는 걸 눈으로 봤을 때 성취감이 컸습니다.
또한, 화이트보드나 채팅처럼 즉각적인 반응이 필요한 기능을 WebSocket으로 구현하면서  
실시간 동기화에 대한 감각과 이벤트 흐름에 대한 이해도 함께 키울 수 있었습니다.

혼자였다면 끝까지 구현하지 못했을 기능들을 팀원들과 함께 고민하고 나누며 완성해나가는 과정에서  
개발자로서의 자신감과 협업의 재미를 크게 느낄 수 있었습니다.


