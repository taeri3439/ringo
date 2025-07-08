import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../first.css';
import './Login.css';
import Header from "../../components/header/Header";
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !password) {
            alert('아이디와 비밀번호를 모두 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    userPw: password,
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/main';
            } else {
                alert(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
            }

        } catch (error) {
            alert('로그인 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="login-background">
            <div className="login-box">
                {/* ...생략... */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="login-input"
                        placeholder="아이디"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                    />
                    <input
                        type="password"
                        className="login-input"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="off"
                    />
                    <button type="submit" className="login-btn">로그인</button>
                </form>
                <div className="login-links">
                    <a href="/users/idfind" className="login-link">아이디 찾기</a>
                    <span className="login-divider">|</span>
                    <a href="/users/pwchange" className="login-link">비밀번호 찾기</a>
                </div>
                <div className="login-social-title">소셜 계정으로 간편 로그인</div>
                <div className="login-social-icons">
                    <a href="#"><img src="/img/naver.png" alt="네이버" /></a>
                    <a href="#"><img src="/img/kakao.png" alt="카카오" /></a>
                    <a href="#"><img src="/img/google.png" alt="구글" /></a>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>

        <MyHeader/>
        <Login/>
        <Footer />


    </>
);
