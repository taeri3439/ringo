import React, {useState, useEffect} from 'react';
import './ProductDetailReview.css';
import ReactDOM from "react-dom/client";

import ProductDetail from "../ProductDetail";


function ProductDetailReview({lectureId}) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`/lecture/getLectureReviews?lectureId=${lectureId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
            });
    }, [lectureId]);

    const [activeIndex, setActiveIndex] = useState(null);
    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    }


    return (
        <>

            <div>
                <section className="section">
                    <div className="section-title">수업 리뷰</div>
                    <div className="review-write"
                         onClick={() => window.location.href = `/lecture/lecturereview?lectureId=${lectureId}`}>
                        리뷰쓰기
                    </div>
                    <div className="review-list">
                        {reviews.map((reviews, index) => (
                            <>
                            <div key={index} className="review-item" onClick={() => handleToggle(index)}>
                                <div className="reviewProfileAndTitle">
                                    <div className="exampleImageBlack review-image">
                                        {reviews.userProfileImage ? (
                                            <img
                                                src={reviews.userProfileImage}
                                                alt="유저프로필 사진"

                                            //     String base64Image = Base64.getEncoder().encodeToString(loginUser.getUserProfile());
                                            // String imageSrc = "data:" + loginUser.getUserProfileMimeType() + ";base64," + base64Image;


                                            />
                                        ) : (
                                            <img
                                                src="/img/profile_default.png"
                                                alt="기본프로필 사진"
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <p className="review-author">{reviews.recruitmentReviewTitle}</p>
                                        <p className="review-text">{reviews.userNickName} • {reviews.recruitmentReviewTime?.slice(0,10)}</p>
                                    </div>
                                </div>

                                <div className={`review-content ${activeIndex === index ? "active" : ""}`}>
                                    <p>{reviews.recruitmentReviewContent}</p>
                                </div>

                            </div>


                            </>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <ProductDetailReview />
//     </>
// );

export default ProductDetailReview;