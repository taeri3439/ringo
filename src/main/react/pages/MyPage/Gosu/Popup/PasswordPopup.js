import React, {useState} from 'react';
import './PasswordPopup.css';

function PasswordPopup({onClose, onSubmit}) {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        onSubmit(input);
    };

    return (
        <div className="password-popup-overlay">
            <div className="password-popup">
                <h3>비밀번호 확인</h3>
                <p>이 수업은 비밀번호가 필요합니다.<br/>비밀번호를 입력하세요.</p>
                <input
                    type="password"
                    className="popup-input"
                    placeholder="비밀번호"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div style={{marginTop: "20px", display: "flex", justifyContent: "flex-end", gap:"30px"}}>
                    <button onClick={handleSubmit}>확인</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default PasswordPopup;
