import React, { useEffect, useState, useRef } from "react";
import "./Hero.css";

const heroCategories = ["블로그", "PPT", "코딩", "로고 디자인", "PPT", "코딩", "로고 디자인"];

const images = [
    "/img/Carousel1.png",
    "/img/Carousel2.png",
    "/img/Carousel3.png",
    "/img/Carousel4.png",
    // ...이미지 경로 추가
];

function Hero() {
    const [index, setIndex] = useState(0);
    const timerRef = useRef(null);

    // 자동 슬라이드 타이머 시작 함수
    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setIndex(prev => (prev + 1) % images.length);
        }, 2000);
    };

    // 마운트 시 타이머 시작, 언마운트 시 정리
    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    // 버튼 클릭 시: 다음 이미지 + 타이머 리셋
    const goToNext = () => {
        setIndex(prev => (prev + 1) % images.length);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        startTimer();
    };

    return (
        <section className="hero-section">
            <div>
                <p className="sub-heading">지금 인기 있는 고수</p>
                <h1 className="main-heading">
                    더 나은 내일을 위한 선택,<br />지금
                    <span className="highlight-text"> 연결</span>하세요
                </h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="원하는 서비스를 검색해보세요"
                        className="search-input"
                    />
                    <img className="search-button" src="/img/search.png" alt="검색" />
                </div>
                <div className="hero-categories">
                    {heroCategories.map((cat, i) => (
                        <span key={i} className="category">{cat}</span>
                    ))}
                </div>
            </div>
            <div className="carousel-container">
                {images.map((img, i) => (
                    <img
                        key={img}
                        src={img}
                        alt={`slide-${i}`}
                        className={`carousel-image ${i === index ? "active" : ""}`}
                    />
                ))}
                <button className="carousel-next-btn" onClick={goToNext}>
                    {index + 1} / {images.length} <span style={{fontWeight: "bold"}}>{"\u25B6"}</span>
                </button>
            </div>
        </section>
    );
}

export default Hero;
