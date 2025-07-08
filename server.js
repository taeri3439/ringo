const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = 8687;

const userMap = {};
const roomCounts = {};
const maxClientsPerRoom = 2;

let savedCanvasJSON = null;

io.on("connection", (socket) => {
    console.log("✅ 연결됨:", socket.id);
    socket.isLeaved = false;

    //
    // ✅ 1) RTC/WebRTC용 join
    //
    socket.on("join", ({ roomId, userId }) => {
        if (!roomCounts[roomId]) {
            roomCounts[roomId] = 1;
        } else if (roomCounts[roomId] < maxClientsPerRoom) {
            roomCounts[roomId]++;
        } else {
            socket.emit("room-full", roomId);
            return;
        }

        socket.join(roomId);
        socket.userId = userId;
        socket.roomId = roomId;

        console.log(`🟢 RTC User ${userId} joined room ${roomId}`);
    });

    //
    // ✅ 2) 공유용 join room
    //
    socket.on("join room", ({ room, username, module }) => {
        if (socket.rooms.has(room)) {
            console.log(`ℹ️ 이미 ${room} 방에 있음: ${socket.id}`);
            return;
        }

        socket.join(room);
        userMap[socket.id] = { username, module };  // ✅ module도 저장!
        // userMap[socket.id] = username;

        if (module === "chat") {
            // ✅ 자기 자신 빼고 broadcast!
            socket.to(room).emit("chat-message", `${username}님이 입장했습니다.`);
            console.log(`💬 ${username} joined room ${room}`);
        } else {
            console.log(`ℹ️ ${username} joined room ${room} (module=${module})`);
        }
    });

    //
    // ✅ 채팅 메시지
    //
    socket.on("chat-message", (message) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) {
            socket.to(room).emit("chat-message", {
                text: message,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
        } else {
            console.warn(`⚠️ 채팅 방이 없음: ${socket.id}`);
        }
    });

    //
    // ✅ 코드 에디터
    //
    socket.on("code-update", (code) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) {
            socket.to(room).emit("code-update", code);
        } else {
            console.warn(`⚠️ 코드 방이 없음: ${socket.id}`);
        }
    });

    //
    // ✅ 화이트보드
    //
    socket.on("draw-path", (p) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) socket.to(room).emit("draw-path", p);
    });

    socket.on("add-object", (o) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) socket.to(room).emit("add-object", o);
    });

    socket.on("modify-object", (d) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) socket.to(room).emit("modify-object", d);
    });

    socket.on("remove-object", (id) => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const room = joinedRooms[0];
        if (room) socket.to(room).emit("remove-object", id);
    });

    socket.on("save-canvas", (json) => {
        savedCanvasJSON = json;
    });

    socket.on("request-canvas-init", () => {
        if (savedCanvasJSON) {
            const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
            const room = joinedRooms[0];
            if (room) socket.emit("canvas-init", savedCanvasJSON);
        }
    });

    //
    // ✅ WebRTC 신호 교환
    //
    socket.on("rtc-message", (data) => {
        const parsed = JSON.parse(data);
        const room = parsed.roomId;
        socket.to(room).emit("rtc-message", data);
    });

    //
    // ✅ leave room — 메시지 없음 (disconnecting에서만 처리!)
    //
    socket.on("leave room", (room) => {
        if (socket.isLeaved) return;
        socket.leave(room);
        socket.isLeaved = true;
    });

    //
// ✅ disconnecting — module === 'chat'일 때만 퇴장 처리!
//
    socket.on("disconnecting", () => {
        const joinedRooms = [...socket.rooms].filter(r => r !== socket.id);
        const uniqueRooms = [...new Set(joinedRooms)];
        const roomId = uniqueRooms[0];  // 첫 번째 방만 처리
        const username = userMap[socket.id] || "알 수 없음";

        // ✅ userMap에 저장된 module 값으로 chat 모듈인지 확인
        // 1) join room에서 저장할 때 { username, module } 둘 다 저장해야 함!
        const userInfo = userMap[socket.id] || {};
        const userName = userInfo.username || username;
        const moduleType = userInfo.module || "unknown";

        if (roomId && moduleType === "chat") {
            socket.to(roomId).emit("chat-message", `${userName}님이 퇴장했습니다.`);
            socket.to(roomId).emit("peer-left", { roomId });

            if (roomCounts[roomId]) {
                roomCounts[roomId]--;
                if (roomCounts[roomId] <= 0) delete roomCounts[roomId];
            }
        }

        socket.isLeaved = true;
        delete userMap[socket.id];
    });

});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
