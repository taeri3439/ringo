import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './Meeting.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import io from 'socket.io-client';
import socket from '../../socket';
import Chat from "./Chat";
import Code from "./Code";
import Whiteboard from "./Whiteboard";
import AIPopup from "./AIPopup";
import ExitConfirmPopup from "./ExitConfirmPopup";
import Timetable from "../MyPage/User/Timetable/Timetable";

function Meeting() {
    const localVideoRef = useRef(null);
    const peerVideoRef = useRef(null);
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);

    const [volume, setVolume] = useState(50);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [showWhiteBoard, setShowWhiteBoard] = useState(false);
    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [showTooltip, setShowTooltip] = useState(true);
    const [aiResponse, setAiResponse] = useState(null);
    const [currentUserNickname] = useState("익명사용자");
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [exitTarget, setExitTarget] = useState(null);
    const [roomId, setRoomId] = useState(window.roomId || '');
    const [meetingTitle] = useState(window.meetingTitle || 'Ringo Meeting');
    const [userId] = useState(window.userId || 'guest');
    const [statusText, setStatusText] = useState("상대방 카메라/마이크 상태");
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [myRole, setMyRole] = useState('고수'); // 기본값 고수, 필요시 '제자'로 변경
    const [peerId, setPeerId] = useState(null);
    const [peerRole, setPeerRole] = useState('제자'); // 상대방 역할


    const icons = [
        'fas fa-camera',
        'fas fa-calendar',
        'fas fa-code',
        'fas fa-pencil',
    ];


    // 시간 업데이트
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // 방 ID 유효성 체크
    useEffect(() => {
        if (!window.roomId || window.roomId.trim() === "") {
            alert("방 ID가 없습니다.");
            window.location.href = "/";
        } else {
            setRoomId(window.roomId);
        }
    }, []);

    // 소켓 연결 및 WebRTC 이벤트 설정
    useEffect(() => {
        if (!roomId || !userId) {
            alert("잘못된 접근입니다.");
            window.location.href = "/";
            return;
        }

        // socketRef.current = io("http://172.30.1.12:8687");
        socket.connect();
        socketRef.current = socket;
        socketRef.current.emit("join", {roomId, userId});

        socketRef.current.on("room-full", () => {
            alert("입장 인원 초과");
            window.location.href = "/";
        });

        socketRef.current.on("rtc-message", async (message) => {
            const content = JSON.parse(message);
            const pc = pcRef.current;

            switch (content.event) {
                case "offer": {
                    const connection = await initConnection();
                    await connection.setRemoteDescription(content.data);
                    await getMedia(connection);
                    const answer = await connection.createAnswer();
                    await connection.setLocalDescription(answer);
                    sendSignal("answer", answer);
                    break;
                }
                case "answer": {
                    if (pc) await pc.setRemoteDescription(content.data);
                    break;
                }
                case "candidate": {
                    if (content.data && pc) await pc.addIceCandidate(content.data);
                    break;
                }
                case "status": {
                    updatePeerStatus(content.data);
                    break;
                }
                default:
                    break;
            }
        });

        socketRef.current.on("peer-left", () => {
            setStatusText("상대방이 연결을 종료했습니다.");
            if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
        });

        createOffer();

        return () => {
            leaveRoom();
        };
    }, [roomId, userId]);

    useEffect(() => {
        if (peerVideoRef.current && remoteStream) {
            peerVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        if (activeIndex === 0 && peerVideoRef.current && remoteStream) {
            peerVideoRef.current.srcObject = remoteStream;
        }
    }, [activeIndex, remoteStream]);


    // PeerConnection 초기화
    // iceServers 설정 하고, 연결 객체 생성 - RTCPeerConnection
    const initConnection = async () => {
        const pc = new RTCPeerConnection({
            iceServers: [{urls: "stun:stun.l.google.com:19302"}],
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) sendSignal("candidate", event.candidate);
        };

        pc.ontrack = (event) => {
            // if (peerVideoRef.current) peerVideoRef.current.srcObject = event.streams[0];
            setRemoteStream(event.streams[0]);
        };

        pcRef.current = pc;
        return pc;
    };

    // 미디어 스트림 얻기 및 트랙 추가
    const getMedia = async (pc) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
            setMyStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        } catch (e) {
            console.error("Media Error:", e);
        }
    };

    // offer 생성 및 전송
    const createOffer = async () => {
        const pc = await initConnection();
        await getMedia(pc);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal("offer", offer);
    };

    // 신호 메세지 전송
    const sendSignal = (event, data) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("rtc-message", JSON.stringify({roomId, event, data}));
        }
    };

    // 카메라 토글
    const toggleCamera = () => {
        if (!myStream) return;
        const videoTrack = myStream.getVideoTracks()[0];
        if (!videoTrack) return;
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        notifyStatus();
    };

    // 마이크 토글
    const toggleMic = () => {
        if (!myStream) return;
        const audioTrack = myStream.getAudioTracks()[0];
        if (!audioTrack) return;
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        notifyStatus();
    };

    // 내 상태 상대방에게 알림
    const notifyStatus = () => {
        const status = {
            camera: myStream?.getVideoTracks()[0]?.enabled,
            mic: myStream?.getAudioTracks()[0]?.enabled,
        };
        sendSignal("status", status);
    };

    // 상대방 상태 업데이트
    const updatePeerStatus = (data) => {
        const cam = data.camera ? "켜짐" : "꺼짐";
        const mic = data.mic ? "켜짐" : "꺼짐";
        setStatusText(`상대방 카메라: ${cam} / 마이크: ${mic}`);
    };

    // 방 나가기
// ✅ 개선된 leaveRoom 함수
    const leaveRoom = (callback) => {
        if (!socketRef.current || !socketRef.current.connected) {
            if (callback) callback();
            return;
        }

        socketRef.current.emit("leave room", roomId);

        // ✅ 서버로부터 확인 이벤트가 오면 그때 disconnect
        socketRef.current.once("left room", () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;   ``
            }
            if (callback) callback();
        });

        // ⛔ fallback timeout: 1초 후 강제 disconnect (서버 응답 없을 경우)
        setTimeout(() => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (callback) callback();
        }, 1000);
    };


    // 시간 포맷팅 mm:ss
    const formatTime = (sec) => {
        const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
        const seconds = String(sec % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    // 녹음 시작
    const handleStartRecording = async () => {
        try {
            setShowTooltip(false);
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, {type: "audio/webm"});
                setSeconds(0);
                clearInterval(timerRef.current);
                setRecording(false);
                setShowTooltip(true);

                const formData = new FormData();
                formData.append("file", blob, "audio.webm");
                formData.append("speaker", currentUserNickname);

                try {
                    const res = await fetch("/stt/upload", {
                        method: "POST",
                        body: formData,
                    });
                    const text = await res.text();
                    setAiResponse(text);
                } catch (error) {
                    console.error("STT 처리 실패", error);
                    setAiResponse("음성 인식에 실패했습니다.");
                }
            };

            recorder.start();
            setRecording(true);

            timerRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev + 1 >= 180) {
                        if (recorder.state === "recording") recorder.stop();
                        clearInterval(timerRef.current);
                        return 180;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch (err) {
            console.error("마이크 권한 오류", err);
        }
    };

    // 녹음 중지
    const handleStopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        setRecording(false);
        clearInterval(timerRef.current);
        setSeconds(0);
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    const handleCenterClick = () => {
        setExitTarget('/mypage/mypageuser');
        setShowExitPopup(true);
    };

    const handleLogoClick = () => {
        setExitTarget('/main.do');
        setShowExitPopup(true);
    };

    const handleExitConfirm = () => {
        if (exitTarget) {
            leaveRoom(() => {
                window.location.href = exitTarget;
            });
        }
    };

    const handleExitCancel = () => {
        setShowExitPopup(false);
        setExitTarget(null);
    };

    const date = currentTime.toISOString().slice(0, 10);
    const time = currentTime.toLocaleTimeString('en-GB');

    useEffect(() => {
        // URL 또는 window 변수를 보고 역할 결정
        // 예시: /meeting/master → 고수, /meeting/student → 제자
        if (window.location.pathname.includes('student')) {
            setMyRole('제자');
            setPeerRole('고수');
        } else {
            setMyRole('고수');
            setPeerRole('제자');
        }
    }, []);

// 소켓에서 상대방 userId를 받아올 때
    useEffect(() => {
        socketRef.current.on("peer-join", ({userId}) => {
            setPeerId(userId);
        });
    }, []);

    return (
        <div>
            <div className="container">
                <div className="sidebar">
                    <div className="logo">
                        <img src="/img/logo.png" alt="logo" onClick={handleLogoClick}/>
                    </div>
                    <div className="sidebar-btn">
                        <ul>
                            {icons.map((icon, index) => (
                                <li key={index} className={activeIndex === index ? 'on' : ''}>
                                    <button
                                        className={activeIndex === index ? "action" : ""}
                                        onClick={() => {
                                            setActiveIndex(index);
                                            if (icon === "fas fa-code") {
                                                setShowCode(true);          // 무조건 켜기
                                                setShowWhiteBoard(false);   // 다른 건 끄기
                                            } else if (icon === "fas fa-pencil") {
                                                setShowWhiteBoard(true);
                                                setShowCode(false);
                                            } else {
                                                // 'fas fa-camera'나 다른 아이콘일 경우
                                                setShowCode(false);
                                                setShowWhiteBoard(false);
                                            }
                                        }}

                                    >
                                        <i className={icon}></i>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="ai">
                        {aiResponse && <AIPopup message={aiResponse} onClose={() => setAiResponse(null)}/>}

                        <div>
                            {recording && (
                                <div style={{padding: "5px 10px", borderRadius: "8px", display: "inline-block"}}>
                                    ⏺️ {formatTime(seconds)}
                                </div>
                            )}
                            {recording && (
                                <button
                                    onClick={handleStopRecording}
                                    style={{marginTop: "10px", display: "inline-block"}}
                                >
                                    <i className="fas fa-stop"></i>
                                </button>
                            )}
                        </div>

                        {showTooltip && (
                            <div className="tooltip">
                                <p>링고가 고수의 수업을 정리해드릴게요!<br/>녹음은 3분까지 가능합니다.⏳</p>
                            </div>
                        )}
                        <figure onClick={handleStartRecording}>
                            <img src="/img/ai.png" alt="AI 녹음 시작"/>
                        </figure>
                    </div>
                </div>

                <div className="wrap">
                    {/*<ul className={`top ${isFullScreen ? 'hidden' : ''}`}>*/}
                    {/*    <li>*/}
                    {/*        <figure><img src={myRole === '고수' ? "/img/me.jpg" : "/img/me2.jpg"} alt={`${myRole} 얼굴`} /></figure>*/}
                    {/*        <div>*/}
                    {/*            <p>{userId}</p>*/}
                    {/*            <span>{myRole}</span>*/}
                    {/*        </div>*/}
                    {/*    </li>*/}
                    {/*    {peerId && (*/}
                    {/*        <li>*/}
                    {/*            <figure>*/}
                    {/*                <img src={peerRole === '고수' ? "/img/me.jpg" : "/img/me2.jpg"} alt={`${peerRole} 얼굴`} />*/}
                    {/*            </figure>*/}
                    {/*            <div>*/}
                    {/*                <p>{peerId}</p>*/}
                    {/*                <span>{peerRole}</span>*/}
                    {/*            </div>*/}
                    {/*        </li>*/}
                    {/*    )}*/}
                    {/*</ul>*/}

                    <div className={`contents ${isFullScreen ? 'height' : ''}`}>
                        <div className="main-content">
                            <div className={`header ${isFullScreen ? 'hidden' : ''}`}>
                                <p>{date}</p>
                                <h2>{meetingTitle}</h2>
                                <span><img src="/img/clock.png" alt="clock"/> {time}</span>
                            </div>
                            <div className="video-section">
                                <video
                                    id="peerVideo"
                                    ref={peerVideoRef}
                                    autoPlay
                                    playsInline
                                    style={{
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        display: activeIndex === 0 ? 'block' : 'none',
                                    }}
                                />

                                <div
                                    className="schedule-container"
                                    style={{display: activeIndex === 1 ? 'block' : 'none'}}
                                >
                                    <Timetable/>
                                </div>

                                <div
                                    className="code-container"
                                    style={{display: activeIndex === 2 ? 'block' : 'none'}}
                                >
                                    <Code/>
                                </div>

                                <div
                                    className="white-container"
                                    style={{
                                        visibility: activeIndex === 3 ? 'visible' : 'hidden',
                                        zIndex: activeIndex === 3 ? 1 : -1,
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <Whiteboard isActive={activeIndex === 3}/>
                                </div>


                                {/* 볼륨 조절 UI */}
                                <div className="volume-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={e => setVolume(e.target.value)}
                                        className="volume-slider"
                                    />
                                    <div className="volume-level">{volume}%</div>
                                </div>

                                <div className="video-controls">
                                    <button className="center" style={{backgroundColor: "#f33e3b"}}>
                                        <img src="/img/phone.png" alt="종료" onClick={handleCenterClick}/>
                                    </button>
                                </div>
                                <div className="seeAll" onClick={() => setIsFullScreen(prev => !prev)}>
                                    <img src={isFullScreen ? "/img/seeSmall.png" : "/img/seeAll.png"} alt="전체화면 전환"/>
                                </div>
                            </div>
                        </div>

                        <div className={`side-panel ${isFullScreen ? 'hidden' : ''}`}>
                            <div className="my-screen">
                                <video
                                    id="myFace"
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    style={{width: "100%", borderRadius: "20px"}}
                                />
                                <div className="my-screen-box">
                                    <button className="side" id="toggle-mic" onClick={toggleMic}>
                                        <img src={isMicOn ? "/img/voice.png" : "/img/voice-off.png"} alt="마이크 토글"/>
                                    </button>
                                    <button className="side" id="toggle-camera" onClick={toggleCamera}>
                                        <img src={isCameraOn ? "/img/camera.png" : "/img/camera-off.png"} alt="카메라 토글"/>
                                    </button>
                                </div>
                            </div>

                            <Chat/>
                        </div>
                    </div>
                </div>
            </div>

            {showExitPopup && (
                <ExitConfirmPopup
                    message="회의방을 나가면 다시 입장해야 합니다. 정말 나가시겠습니까?"
                    onConfirm={handleExitConfirm}
                    onCancel={handleExitCancel}
                />
            )}

            <script src="https://kit.fontawesome.com/599a3a7868.js" crossOrigin="anonymous"></script>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Meeting/>);
