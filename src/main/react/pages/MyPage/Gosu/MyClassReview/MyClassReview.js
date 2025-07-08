import React, { useState, useEffect } from "react";
import './MyClassReview.css';
import ReactDOM from "react-dom/client";

function MyClassReview({ showAll = false, setActiveTab }) {
    const [myLectures, setMyLectures] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    // 1. 내 강의 목록 불러오기
    useEffect(() => {
        fetch('/users/api/user/info', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const userId = data.user.userPrimaryId;
                    fetch(`/api/mypage/mylectures?userPrimaryId=${userId}`)
                        .then(res => res.json())
                        .then(data => setMyLectures(data));
                }
            });
    }, []);

    // 2. 내 강의에 달린 리뷰 불러오기
    useEffect(() => {
        if (myLectures.length === 0) return;
        Promise.all(
            myLectures.map(lecture =>
                fetch(`/lecture/getLectureReviews?lectureId=${lecture.recruitmentPostId}`)
                    .then(res => res.json())
            )
        ).then(allReviews => {
            setMyReviews(allReviews.flat());
        });
    }, [myLectures]);

    // 3. showAll, 더보기, 아코디언 등은 기존과 동일하게 적용
    const displayedReviews = showAll ? myReviews : myReviews.slice(0, 3);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="section">
            <h2 className="section-title">강의 리뷰</h2>
            <div className="review-list">
                {displayedReviews.map((review, index) => (
                    <div
                        key={index}
                        className="review-item"
                        onClick={() => handleToggle(index)}
                        style={{ cursor: "pointer" }}
                    >


                        <div className="reviewProfileAndTitle">
                            <div className="exampleImageBlack review-image">
                                {review.userProfileImage ? (
                                    <img
                                        src={review.userProfileImage}
                                        alt="유저프로필 사진"
                                    />
                                ) : (
                                    <img
                                        src="/img/profile_default.png"
                                        alt="기본프로필 사진"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="review-author">{review.recruitmentReviewTitle}</p>
                                <p className="review-text">
                                    <span>{review.userNickName} • </span>
                                    <span className={"text-time"}>{review.recruitmentReviewTime?.slice(0, 10)}</span>
                                </p>
                            </div>
                        </div>


                        <div className={`review-content ${activeIndex === index ? "active" : ""}`}>
                            <p>{review.recruitmentReviewContent}</p>
                        </div>
                    </div>
                ))}
                {myReviews.length > 3 && !showAll && setActiveTab && (
                    <>
                        <div className="blank"></div>
                        <figure onClick={() => setActiveTab("review")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyClassReview;