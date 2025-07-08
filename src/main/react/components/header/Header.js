import React, { useState, useEffect } from "react";
import './Header.css';


function Header() {
    const [loginUser, setLoginUser] = useState(null);

    useEffect(() => {
        fetch("/users/api/user/info", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setLoginUser(data.user);
                } else {
                    setLoginUser(null);
                }
            })
            .catch(() => setLoginUser(null));
    }, []);

    const handleLogout = () => {
        fetch("/logout", { method: "POST", credentials: "include" })
            .then(() => {
                window.location.href = "/main";
            })
            .catch(() => {
                window.location.href = "/main";
            });
    };

    return (
        <div className="header-container">
            <header className="header">
                <a href="/main">
                    <div className="logo">
                        <img src="/img/logo.png" alt="로고"/>
                    </div>
                </a>

                <nav className="nav navCenter">

                    <a href="/lecture/lectureinfo">강의정보</a>
                    <a href="/community/communitylist">커뮤니티</a>
                    <a href="/qna/qnalist">문의사항</a>
                    <a href="/notice/noticelist">공지사항</a>
                </nav>

                <nav className="nav">
                    <a href="#">
                        <img src="/img/headerChat.png" alt="쪽지"/>
                    </a>
                    <a href="#">
                        <img src="/img/notification.png" alt="알림"/>
                    </a>
                    {loginUser ? (
                        <>
                            <a href="#" onClick={e => { e.preventDefault(); handleLogout(); }}>로그아웃</a>
                            <a href="/mypage/mypageuser">
                                <button className="mypage-button">마이페이지</button>
                            </a>
                        </>
                    ) : (
                        <>
                            <a href="/users/login">로그인</a>
                            <a href="/users/signup">
                                <button className="signup-button">회원가입</button>
                            </a>

                        </>
                    )}
                </nav>
            </header>
            <div className="header-letterbox"/>
        </div>
    );
}

export default Header;