// PopularServices.js
import React from "react";
import "./PopularService.css";

const services = [
    {
        img: "/img/makeBlogThumbnail.png",
        title: "내 블로그가 핫한 브랜드가 되다! 블로그 제작",
        rating: "4.8",
        reviews: "158",
        price: "1,123,123원~",
        provider: "중앙개발원",
    },
    {
        img: "/img/animationThumbnail.png",
        title: "Quick 애니메이션 모션 그래픽!",
        rating: "4.8",
        reviews: "158",
        price: "1,123,123원~",
        provider: "중앙개발원",
    },
    {
        img: "/img/thumbnail.png",
        title: "이거는 사진이 도대체 뭔지 모르겠다!",
        rating: "4.8",
        reviews: "158",
        price: "1,123,123원~",
        provider: "중앙개발원",
    },
    {
        img: "/img/Ga4Thumbnail.png",
        title: "GoogleGA4설치! 이정도는 혼자 할줄 알아야겠죠?",
        rating: "4.8",
        reviews: "158",
        price: "1,123,123원~",
        provider: "중앙개발원",
    },
];

const PopularService = () => (
    <div className="popular-services-layout">
        <div className="popular-services-left">
            <h2 className="title">
                지금 인기 있는 <span className="highlight">서비스</span>
            </h2>
        </div>
        <div className="popular-services-right">
            <div className="popular-services-grid">
                {services.map((svc) => (
                    <div className="popular-service-card"
                         key={svc.id}
                         onClick={() => window.location.href = "/lecture/lecturedetail"}
                    >
                        <img src={svc.img} alt={svc.title} className="popular-service-img" />
                        <div className="popular-service-title">{svc.title}</div>
                        <div className="popular-service-rating">
                            <span className="star">★</span>
                            <span className="rating">{svc.rating}</span>
                            <span className="reviews">({svc.reviews})</span>
                        </div>
                        <div className="popular-service-author">
                            <img
                                src="/img/expertProfile.png"
                                alt="author"
                                className="author-avatar"
                            />
                            <span>{svc.provider}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PopularService;
