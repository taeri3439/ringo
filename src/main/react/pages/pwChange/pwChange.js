import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../first.css';
import './pwChange.css'; // 이 파일의 CSS는 그대로 유지됩니다.
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function PasswordChange() {

    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [phone, setPhone] = useState('');

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
        if (value.length < 4) {
            setPhone(value);
        } else if (value.length < 8) {
            setPhone(value.slice(0,3) + '-' + value.slice(3));
        } else {
            setPhone(value.slice(0,3) + '-' + value.slice(3,7) + '-' + value.slice(7,11));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 새로고침 동작 방지

        // 간단한 유효성 검사
        if (!name.trim() || !userId.trim() || phone.length !== 13) {
            alert('모든 정보를 올바르게 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/users/verify-user-for-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName: name, userId: userId, userPhone: phone }),
            });

            const result = await response.json();

            if (result.success) {
                // 인증 성공 시, 다음 단계인 비밀번호 재설정 페이지로 이동
                window.location.href = '/users/pwreset';
            } else {
                // 인증 실패 시, 서버가 보낸 메시지를 알림으로 표시
                alert(result.message || '입력하신 정보와 일치하는 회원이 없습니다.');
            }
        } catch (error) {
            console.error('사용자 인증 중 오류 발생:', error);
            alert('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    return (

        <div className="background">
            <div className="box">
                <div className="title">
                    <h1>비밀번호 변경</h1>
                </div>

                <form className="pwchange-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label className="form-label" htmlFor="name">이름</label>

                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="이름을 입력해주세요."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label" htmlFor="userid">아이디</label>

                        <input
                            type="text"
                            id="userid"
                            className="form-input"
                            placeholder="아이디를 입력해주세요."
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label" htmlFor="phone">연락처</label>
                        <input
                            type="text"
                            id="phone"
                            className="form-input"
                            placeholder="010-0000-0000"
                            value={phone}
                            onChange={handlePhoneChange}
                            maxLength={13}
                            autoComplete="off"
                        />
                    </div>
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
        <PasswordChange/>
        <Footer/>
    </>
);
