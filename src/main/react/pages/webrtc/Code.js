import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import "./Code.css";

// ✅ 서버 주소 맞게
const socket = io("http://172.30.1.12:8687");

function Code() {
    const [code, setCode] = useState("// 시작 코드\nconsole.log('hello~~');");
    const preventLoop = useRef(false);

    useEffect(() => {
        const room = window.roomId || "testRoom";
        const username = window.userName || "익명";

        // ✅ Code 탭 전환 시에도 join room 해서 socket.rooms에 안전하게 방 정보 남김
        socket.emit("join room", { room, username });

        socket.on("code-update", (newCode) => {
            if (!preventLoop.current) {
                setCode(newCode);
            }
        });

        return () => {
            socket.off("code-update");
        };
    }, []);

    const handleChange = (value) => {
        setCode(value);
        preventLoop.current = true;
        socket.emit("code-update", value);
        setTimeout(() => {
            preventLoop.current = false;
        }, 100);
    };

    return (
        <div>
            <Editor
                height="100vh"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleChange}
            />
        </div>
    );
}

export default Code;
