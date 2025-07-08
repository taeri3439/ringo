import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../first.css';
import './pwRest.css';
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function PasswordReset() {
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?`~]).{8,20}$/;
    const [password, setPassword] = useState('');
    const [pwMsg, setPwMsg] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [touched, setTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);


    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordTouched(true);

        if (value.length > 0 && (value.length < 8 || value.length > 20)) {
            setPwMsg("비밀번호는 8~20자 이내여야 합니다.");
        } else if (value.length > 0 && /\s/.test(value)) {
            setPwMsg("비밀번호에 공백을 포함할 수 없습니다.");
        } else if (value.length > 0 && /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(value)) {
            setPwMsg("비밀번호에 한글을 포함할 수 없습니다.");
        } else if (value.length > 0 && !pwRegex.test(value)) {
            setPwMsg("영문, 숫자, 특수문자를 모두 포함해야 합니다.");
        } else {
            // 유효하거나, 필드가 비어있을 경우 메시지를 비웁니다.
            setPwMsg("");
        }
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
        setTouched(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 제출 방지

        // 1. 자체 유효성 검사
        if (pwMsg) {
            alert(pwMsg);
            return;
        }
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!password) {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }

        // 2. 서버에 비밀번호 변경 요청
        try {
            const response = await fetch('/users/reset-password-action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password }), // 새 비밀번호 전송
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    alert('비밀번호가 성공적으로 변경되었습니다.');
                    window.location.href = '/users/login';
                } else {
                    alert(result.message || '비밀번호 변경에 실패했습니다.');
                    window.location.href = '/users/pwchange'; // 실패 시 첫 단계로 이동
                }
            } else {
                // 401 Unauthorized 등
                alert('인증에 실패했습니다. 비밀번호 찾기를 처음부터 다시 시도해주세요.');
                window.location.href = '/users/pwchange';
            }
        } catch (error) {
            console.error('비밀번호 변경 중 오류 발생:', error);
            alert('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    const isMismatch = touched && password && passwordConfirm && password !== passwordConfirm;

    return (
        <div className="background">
            <div className="box">
                <div className="title">
                    <h1>비밀번호 변경</h1>
                </div>
                <form className="pwchange-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label className="form-label" htmlFor="password">새 비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="비밀번호 입력해주세요."
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                        />
                    </div>
                    {/* 비밀번호 유효성 메시지 */}
                    {passwordTouched && pwMsg && (
                        <div className="pw-error">{pwMsg}</div>
                    )}
                    <div className="form-row">
                        <label className="form-label" htmlFor="passwordConfirm">새 비밀번호 확인</label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            className="form-input"
                            placeholder="비밀번호 입력해주세요."
                            value={passwordConfirm}
                            onChange={handlePasswordConfirmChange}
                            autoComplete="new-password"
                        />
                    </div>
                    {isMismatch && (
                        <div className="pw-error">
                            비밀번호가 일치하지 않습니다.
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="pwchange-button">비밀번호 변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <PasswordReset/>
        <Footer/>
    </>
);
