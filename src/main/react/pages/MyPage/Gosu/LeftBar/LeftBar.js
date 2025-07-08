import React, { useEffect, useState } from "react";
import './LeftBar.css';
import ReactDOM from "react-dom/client";

export default function LeftBar({activeTab, setActiveTab, onBack }) {
    const [userInfo, setUserInfo] = useState(null);
    const [profileImage, setProfileImage] = useState("/img/screen1.jpg");

    useEffect(() => {
        fetch('/users/api/user/info', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserInfo(data.user);
                    setProfileImage(data.userProfileImage || "/img/screen1.jpg");
                }
            });
    }, []);

    return (
        <aside className="sidebar">
            <div className="profile">
                <div className="profile-image">
                    <img
                        src={profileImage}
                        alt="프로필사진"
                    />

                </div>
                <p className="profile-name">
                    {userInfo?.userNickName ? userInfo.userNickName : "닉네임"}
                </p>


                <button
                    className="edit-button"
                    onClick={() => window.location.href = "/users/userinfo"}
                >
                    회원정보 수정
                </button>
                <ul className="menu">
                    <li onClick={() => setActiveTab("home")}
                        className={`menu-item ${activeTab === "home" ? "selected" : ""}`}>
                        홈
                    </li>
                    <li onClick={() => setActiveTab("intro")}
                        className={`menu-item ${activeTab === "intro" ? "selected" : ""}`}>
                        소개글
                    </li>
                    <li onClick={() => setActiveTab("study")}
                        className={`menu-item ${activeTab === "study" ? "selected" : ""}`}>
                        내 강의
                    </li>
                    <li onClick={() => setActiveTab("review")}
                        className={`menu-item ${activeTab === "review" ? "selected" : ""}`}>
                        내 강의 리뷰
                    </li>
                    <li onClick={() => setActiveTab("timetable")}
                        className={`menu-item ${activeTab === "timetable" ? "selected" : ""}`}>
                        시간표
                    </li>


                </ul>
                <button className="convert-button"
                        onClick={() => {
                            window.location.href = "/lecture/lectureregistration"
                        }}
                           >
                    강의등록
                </button>
                <button className="convert-button" onClick={onBack}>제자 전환</button>
            </div>
        </aside>
    )
}

