// src/main/react/socket.js
import { io } from 'socket.io-client';

const socket = io('http://172.30.1.12:8687', {
    autoConnect: false // 수동 연결 (원할 때 연결)
});

export default socket;
