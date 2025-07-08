import React, {useEffect, useState} from "react";
import './MyReview.css';
import ReactDOM from "react-dom/client";

function MyReview({ showAll = false, setActiveTab }) {
    const [myReview, setMyReview] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        fetch('/users/api/user/info')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const user = data.user;
                    console.log(user);

                    if (data.userProfileImage) {
                        const img = document.getElementById('profileImg');
                        if (img) img.src = data.userProfileImage;
                    }

                    fetch(`/api/mypage/myreview?userPrimaryId=${user.userPrimaryId}`)
                        .then(res => res.json())
                        .then(data => {
                            console.log("리뷰 응답:", data);
                            setMyReview(data);
                        });
                } else {
                }
            })
            .catch(error => {
                console.error('유저 정보 요청 실패:', error);
            });
    }, []);

    const displayedReviews = showAll ? myReview : myReview.slice(0, 3);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="section">
            <h2 className="section-title">내가 작성한 리뷰</h2>
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
                                {review.userProfile && review.userProfileMimetype ? (
                                    <img src={`data:${review.userProfileMimetype};base64,${review.userProfile}`} alt="유저프로필 사진" />
                                ) : (
                                    <img src="/img/profile_default.png" alt="기본프로필 사진" />
                                )}
                            </div>
                            <div>
                                <p className="review-author">{review.recruitmentReviewTitle}</p>
                                <p className="review-text">
                                    <span>{review.userNickName} • </span> <span className={"text-time"}>{review.recruitmentReviewTime?.slice(0, 10)}</span>
                                </p>
                            </div>
                        </div>
                        <div className={`review-content ${activeIndex === index ? "active" : ""}`}>
                            <p>{review.recruitmentReviewContent}</p>
                        </div>
                    </div>
                ))}
                {myReview.length > 3 && !showAll && setActiveTab && (
                    <>
                        <div className="blank"></div>
                        <figure onClick={() => setActiveTab("review")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
        </section>
    )
}

export default MyReview;