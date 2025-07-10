👨‍👩‍👧‍👦 화상 수업, 그 이상의 연결
**링고(RINGO)**는 고수의 노하우와 제자의 열정을 실시간으로 이어주는 맞춤형 교육 플랫폼입니다.
사용자는 쉽게 고수가 될 수 있고, 제자가 될 수도 있습니다.

✨ 주요 기능
✅ 회원가입 / 로그인

📝 커뮤니티 작성, 수정, 삭제, 목록 조회

🔍 WebRTC 기반 P2P 영상 연결

💬 실시간 1:1 채팅 (Socket.io)

🖌️ Fabric.js를 사용한 도형, 선, 자유 그리기

🤖 LLM을 활용한 실시간 요약 정리

🛠 사용 기술
Backend

Node.js

Express

Spring Security

WebRTC

Socket.io (실시간 채팅)

express-validator (입력 유효성 검사)

OpenAI API (LLM 요약 기능)

📁 폴더 구조
bash
복사
편집
project/
├── server.js                  # Node 기반 서버 (예: WebSocket 등)
├── build/                     # 빌드된 결과물 (보통 프론트엔드 빌드파일)
├── node_modules/              # Node.js 의존성 모듈
├── public/                    # 정적 파일 (프론트엔드 공개 리소스)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/ringo/   # Spring Boot 백엔드
│   │   │       ├── command/
│   │   │       ├── community/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── lecture/
│   │   │       ├── mypage/
│   │   │       ├── notice/
│   │   │       ├── qna/
│   │   │       ├── room/
│   │   │       ├── users/
│   │   │       ├── util/
│   │   │       └── RingoApplication.java   # Spring Boot 메인 클래스
│   │   ├── react/                 # React 프론트엔드
│   │   │   ├── components/        # 공통 컴포넌트
│   │   │   └── pages/             # 라우트 페이지 구성
│   │   │       ├── community/
│   │   │       ├── IdFind/
│   │   │       ├── LectureInfo/
│   │   │       ├── Login/
│   │   │       ├── main/
│   │   │       ├── MyPage/
│   │   │       ├── Notice/
│   │   │       ├── Product/
│   │   │       ├── pwChange/
│   │   │       ├── Qna/
│   │   │       ├── SignUp/
│   │   │       ├── UserInfo/
│   │   │       └── WebRTC/
│   │   ├── socket.js              # 소켓 통신 관련 JS
│   │   ├── Main.js                # 프론트 메인 진입점 (또는 라우터)
│   │   └── User.js                # 사용자 관련 로직
│   └── test/                      # 테스트 코드
├── gradle/                       # Gradle Wrapper
├── build.gradle                  # Gradle 설정 파일
├── settings.gradle               # Gradle 설정
├── package.json                  # Node.js 의존성 및 스크립트
└── .idea/, .git/, etc.           # 기타 설정 폴더

🚀 실행 방법
npm install
npm run dev
npm run watch
