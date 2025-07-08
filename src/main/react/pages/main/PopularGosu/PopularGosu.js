import React from "react";
import "./PopularGosu.css";

const gosus = [
    {
        img: "/img/expertProfile.png",
        name: "중앙뽕아",
        rating: "4.8",
        desc: [
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
        ],
    },
    {
        img: "/img/expertProfile.png",
        name: "중앙뽕아",
        rating: "4.8",
        desc: [
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
        ],
    },
    {
        img: "/img/expertProfile.png",
        name: "중앙뽕아",
        rating: "4.8",
        desc: [
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
        ],
    },
    {
        img: "/img/expertProfile.png",
        name: "중앙뽕아",
        rating: "4.8",
        desc: [
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
            "타이포그래피, 키네틱 타이틀 인트로로 제작해 드립니다.",
        ],
    },
];

const PopularGosu = () => (
    <div className="popular-gosu-layout">
        <div className="popular-gosu-left">
            <h2 className="popular-gosu-title">
                지금 인기 있는 <span className="popular-gosu-highlight">고수</span>
            </h2>
        </div>
        <div className="popular-gosu-right">
            <div className="popular-gosu-grid">
                {gosus.map((gosu, idx) => (
                    <div className="popular-gosu-card" key={idx}>
                        <div className="popular-gosu-card-header">
                            <img src={gosu.img} alt={gosu.name} className="popular-gosu-avatar" />
                            <div className="popular-gosu-rating">
                                <span className="popular-gosu-star">★</span>
                                <span className="popular-gosu-rating-num">{gosu.rating}</span>
                            </div>
                        </div>
                        <div className="popular-gosu-name">{gosu.name}</div>
                        <div className="popular-gosu-desc">
                            {gosu.desc.map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PopularGosu;
