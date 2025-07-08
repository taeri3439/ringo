import React, { useState, useEffect } from "react";
import "./Interest.css";

const categories = [
    { num: "01", text: "디자인" },
    { num: "02", text: "it·프로그래밍" },
    { num: "03", text: "영상·사진" },
    { num: "04", text: "마케팅" },
    { num: "05", text: "주식·코인" },
    { num: "06", text: "문서·글쓰기" },
    { num: "07", text: "세무·법인·노무" },
    { num: "08", text: "창업·사업" },
    { num: "09", text: "기타" }

];

function InterestsSection() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [loginUser, setLoginUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 서버에서 유저 정보 받아오기
        fetch("/users/api/user/info", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {

                    const user = data.user;
                    const interestTexts = user.userInterest
                    ? user.userInterest.split(",").map(i => i.trim()) : [];

                    const matched = categories.filter(cat => interestTexts.includes(cat.text));

                    setLoginUser({
                        ...user,
                        interests: matched
                    });
                } else {
                    setLoginUser(null);
                }
            })
            .catch(() => setLoginUser(null));
    }, []);

    useEffect(() => {
        if (!loginUser || !loginUser.interests || loginUser.interests.length === 0) return;

        const selectedCategory = loginUser.interests[activeIdx]?.text;
        if (!selectedCategory) return;

        fetch(`/lecture/api/posts/byCategory?category=${encodeURIComponent(selectedCategory)}`)
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Failed to fetch posts:", err));
    }, [activeIdx, loginUser]);



    return (
        <div className={loginUser ? "interests-section show" : "interests-section"}>
            <div className="interests-grid">
                {/* 왼쪽: 관심분야 카테고리 */}
                <div className="interests-categories">
                    <div className="interests-title">
                        <span className="circle">
                            {loginUser && loginUser.userNickName ? loginUser.userNickName : '●●●'}
                        </span>
                        님의<br />
                        관심분야 입니다.
                    </div>
                    <div className="interests-desc">
                        관심분야를 선택하여서 고수를 추천해주는 공고를 찾아드리고,
                        맞춤 서비스로 다양한 소식을 보여드릴게요!
                    </div>
                    <ul className="interests-list">
                        {loginUser?.interests?.map((cat, idx) => (
                            <li
                                key={cat.num}
                                className={activeIdx === idx ? "active" : ""}
                                onClick={() => setActiveIdx(idx)}
                            >
                                <span className="num">{cat.num}</span>
                                <span className="text">{cat.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* 오른쪽: 서비스 카드 2x2 */}
                <div className="interests-cards">
                    {posts.map((posts, idx) => (
                        <div className="service-card"
                             key={posts.recruitmentPostId}
                             onClick={() => window.location.href = `/lecture/lecturedetail?lectureId=${posts.recruitmentPostId}`}
                        >
                            <img src="/img/makeBlogThumbnail.png" alt="이미지" />
                            {/*이미지 바꿔야함*/}
                            <div className="service-title">{posts.recruitmentPostTitle}</div>
                            <div className="service-info">
                                <span className="service-rating">{posts.recruitmentPostContactStartTime?.slice(0,5)} ~ </span>
                                <span className="service-rating">{posts.recruitmentPostContactEndTime?.slice(0,5)}</span>
                                <span className="service-rating"> | {posts.recruitmentPostAvgResponseTime} 연락 가능</span>
                            </div>
                            <div className="service-meta">
                                <span className="service-price">{posts.userId}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InterestsSection;
