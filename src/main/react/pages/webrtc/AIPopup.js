import React from "react";
import "./AIPopup.css"; // 스타일 분리

const AIPopup = ({ message, onClose }) => {
    return (
        <div className="ai-popup-overlay">
            <div className="ai-popup">
                <h3>💡 링고 정리 요약</h3>
                <p>{message}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default AIPopup;
