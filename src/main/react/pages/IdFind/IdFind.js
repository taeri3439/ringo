import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../first.css';
import './IdFind.css';
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function IdFind() {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // 연락처 입력값 자동 하이픈 처리
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length < 4) {
            setPhone(value);
        } else if (value.length < 8) {
            setPhone(value.slice(0, 3) + '-' + value.slice(3));
        } else {
            setPhone(value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11));
        }
    };


    const handleFindId = async () => {

        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }
        if (phone.length !== 13) { // 010-1234-5678 형식 (13자리)
            alert('올바른 연락처를 입력해주세요.');
            return;
        }

        try {

            const response = await fetch('/users/find-id-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ name, phone }),
            });

            const result = await response.json();

            // 서버 응답 결과에 따른 처리
            if (result.success) {
                // 성공 시, 결과 데이터를 sessionStorage에 저장하고 결과 페이지로 이동
                sessionStorage.setItem('foundUserData', JSON.stringify(result));
                window.location.href = '/users/idfindgood';
            } else {
                // 실패 시, 서버가 보낸 메시지를 알림으로 표시
                alert(result.message || '일치하는 회원 정보가 없습니다.');
            }
        } catch (error) {
            console.error('아이디 찾기 중 오류 발생:', error);
            alert('서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    return (
        <div className="background">
            <div className="box">
                <div className="title">
                    <h1>아이디 찾기</h1>
                    <p>회원정보를 입력해 주세요.</p>
                </div>
                <div className="idfind-form">
                    <div className="form-row">
                        <label className="form-label" htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            className="form-input"
                            placeholder="이름을 입력해주세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label" htmlFor="phone">연락처</label>
                        <input
                            type="tel"
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
                        <button type="button" className="findid-button" onClick={handleFindId}>
                            아이디 찾기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <IdFind/>
        <Footer/>
    </>
);