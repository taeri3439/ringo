// 📄 ExitConfirmPopup.jsx
import React from "react";
import "./ExitConfirmPopup.css";

function ExitConfirmPopup({ message, onConfirm, onCancel }) {
    return (
        <div className="ai-popup-overlay">
            <div className="ai-popup-exit">
                <h3>회의방을 나가시겠어요?</h3>
                <p>{message}</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onCancel} style={{ backgroundColor: '#ccc', color: '#333' }}>
                        취소
                    </button>
                    <button onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExitConfirmPopup;
