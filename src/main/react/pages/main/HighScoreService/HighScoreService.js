import React, { useEffect, useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './HighScoreService.css';

const images = [
    { src: "/img/makeBlogThumbnail.png", lectureId: 1},
    { src: "/img/animationThumbnail.png", lectureId: 2},
    { src: "/img/thumbnail.png", lectureId: 3},
    { src: "/img/Ga4Thumbnail.png", lectureId: 4}
];

const HighScoreService = () => {
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        renderMode: 'performance',
        drag: false,
        slides: {
            perView: 4,
            spacing: 15,
        },
    });

    const intervalRef = useRef(null);

    // ✅ 자동 슬라이드 시작
    const startAutoSlide = () => {
        if (!intervalRef.current && instanceRef.current) {
            intervalRef.current = setInterval(() => {
                instanceRef.current?.next();
            }, 1234);
        }
    };

    // ✅ 자동 슬라이드 멈춤
    const stopAutoSlide = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    useEffect(() => {
        startAutoSlide(); // 처음에 자동 시작
        return () => stopAutoSlide(); // 컴포넌트 언마운트 시 정리
    }, [instanceRef]);

    return (
        <>
            <section className="scrolling-section">
                <div className="scrolling-title">링고가 추천하는 <br/>최신 서비스</div>
                <div
                    ref={sliderRef}
                    className="keen-slider"
                    onMouseEnter={stopAutoSlide}
                    onMouseLeave={startAutoSlide}
                >
                    {images.map((image, idx) => (
                        <div className="keen-slider__slide slide" key={idx}>
                            <img src={image.src}
                                 alt={`Slide ${idx}`}
                                 onClick={() => window.location.href = `/lecture/lecturedetail?lectureId=${image.lectureId}`}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default HighScoreService;
