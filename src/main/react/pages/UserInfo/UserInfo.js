// 첨부해주신 파일(paste.txt)을 수정한 전체 코드입니다.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../first.css';
import './UserInfo.css';
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const allTopics = [
    '디자인', 'it·프로그래밍', '영상·사진', '마케팅', '주식·코인',
    '문서·글쓰기', '세무·법인·노무', '창업·사업', '기타'
];

function UserInfo() {

    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState({ year: '', month: '', day: '' });
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);

    const [profileImg, setProfileImg] = useState('/img/profile_default.png');
    const [profileFile, setProfileFile] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/users/api/user/info', {
                    credentials: 'include'
                });
                const result = await response.json();

                if (result.success) {
                    const user = result.user;

                    setName(user.userName || '');
                    setNickname(user.userNickName || '');
                    setGender(user.userGender || '');
                    if (user.userBirth) {
                        const [year, month, day] = user.userBirth.split('T')[0].split('-');
                        setBirth({year, month, day});
                    }
                    setPhone(user.userPhone || '');
                    setEmail(user.userEmail || '');
                    setSelectedTopics(user.userInterest ? user.userInterest.split(',') : []);

                    if (user.userProfile && user.userProfile.length > 0) {
                        setProfileImg(`/users/api/user/profile-image?t=${new Date().getTime()}`);
                    } else {
                        setProfileImg('/img/profile_default.png');
                    }
                } else {
                    alert(result.message || '로그인이 필요합니다.');
                    window.location.href = '/users/login';
                }
            } catch (error) {
                console.error("사용자 정보 로딩 실패:", error);
                alert("정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        fetchUserInfo();

    }, []);

    // 프로필 이미지 핸들러 : 파일 객체도 함께 저장
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImg(URL.createObjectURL(file));
            setProfileFile(file);
        }
    };

    // 연락처 자동 하이픈
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length < 4) setPhone(value);
        else if (value.length < 8) setPhone(value.slice(0, 3) + '-' + value.slice(3));
        else setPhone(value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11));
    };

    // 관심분야 선택
    const handleSelect = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else if (selectedTopics.length < 3) {
            setSelectedTopics([...selectedTopics, topic]);
        } else {
            alert("최대 3개까지만 선택할 수 있습니다.");
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        if (profileFile) {
            formData.append('profileImageFile', profileFile);
        }

        const userInfoData = {
            userName: name,
            userNickName: nickname,
            userPhone: phone,
            userEmail: email,
            userInterest: selectedTopics.join(','),
        };
        formData.append('userInfoData', new Blob([JSON.stringify(userInfoData)], {type: "application/json"}));

        try {
            const response = await fetch('/users/api/user/update', {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });
            const result = await response.json();

            if (result.success) {
                alert(result.message);
                window.location.href = '/mypage/mypageuser';
            } else {
                alert(result.message || "수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="userinfo-background">
            <form className="userinfo-box" onSubmit={handleSubmit}>
                <div className="userinfo-title">회원정보수정</div>
                <div className="profile-img-wrap">
                    <div className="img-box">
                        <img src={profileImg} alt="프로필" className="profile-img"/>
                    </div>
                    <label htmlFor="profile-img-upload" className="profile-img-upload-btn">
                        <img src="/img/profile_camera.png" alt="사진변경"/>
                        <input id="profile-img-upload" type="file" accept="image/*" style={{display: 'none'}}
                               onChange={handleImgChange}/>
                    </label>
                </div>
                <div className="userinfo-form">
                    <div className="userinfo-row"><span className="userinfo-label">이름</span><input type="text"
                                                                                                   className="userinfo-input"
                                                                                                   value={name}
                                                                                                   onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className="userinfo-row"><span className="userinfo-label">별명</span><input type="text"
                                                                                                   className="userinfo-input"
                                                                                                   value={nickname}
                                                                                                   onChange={e => setNickname(e.target.value)}/>
                    </div>
                    <div className="userinfo-row"><span className="userinfo-label">성별</span><span
                        className="userinfo-value">{gender}</span></div>
                    <div className="userinfo-row"><span className="userinfo-label">생년월일</span><span
                        className="userinfo-value">{birth.year}년&nbsp;&nbsp;{birth.month}월&nbsp;&nbsp;{birth.day}일</span>
                    </div>
                    <div className="userinfo-row"><span className="userinfo-label">연락처</span><input type="text"
                                                                                                    className="userinfo-input"
                                                                                                    placeholder="000-0000-0000"
                                                                                                    value={phone}
                                                                                                    onChange={handlePhoneChange}
                                                                                                    maxLength={13}/>
                    </div>
                    <div className="userinfo-row"><span className="userinfo-label">이메일</span><input type="text"
                                                                                                    className="userinfo-input"
                                                                                                    value={email}
                                                                                                    onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="interest-row"><span className="interest-label">관심분야</span><span
                        className="topic-options">{allTopics.map(topic => (
                        <button key={topic} onClick={() => handleSelect(topic)}
                                className={selectedTopics.includes(topic) ? 'selected' : ''}
                                type="button">{topic}</button>))}</span></div>
                </div>

                <div className="userinfo-actions">
                    <button type="submit" className="userinfo-submit-btn">수정 완료</button>
                </div>
            </form>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <UserInfo />
        <Footer />

    </>
);
