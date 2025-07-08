import ReactDOM from "react-dom/client";
import React, {useEffect, useState} from "react";
import "./LectureInfo.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const categories = [
    { label: "디자인", filename: "design", forQuery:"디자인"},
    { label: "IT•프로그래밍", filename: "programming", forQuery:"IT"},
    { label: "영상•사진", filename: "photo", forQuery:"영상"},
    { label: "마케팅", filename: "marketing", forQuery:"마케팅"},
    { label: "주식•코인", filename: "invest", forQuery:"주식"},
    { label: "문서•글쓰기", filename: "document", forQuery:"문서"},
    { label: "세무•법인•노무", filename: "tax", forQuery:"세무"},
    { label: "창업•사업", filename: "business", forQuery:"창업"},
    { label: "전체보기", filename: "all", forQuery:"전체보기"}
]

function LectureInfo() {

    const [lectures, setLectures] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체보기");
    const [keyword, setKeyword] = useState("");
    const [userWishList, setUserWishList] = useState([]);
    const [userPrimaryId, setUserPrimaryId] = useState(null);

    //카테고리와 검색 내용 확인해서 강의 목록 불러오는 함수
    const fetchLectures = async (category, keyword) => {
        const params = new URLSearchParams();
        params.append("category", category);
        if (keyword && keyword.trim() !== "") {
            params.append("search", keyword.trim());
        }

        const response = await fetch(`/lecture/getLectures?${params.toString()}`);
        // setLectures(await response.json());

        const lectureData = await response.json();


        const lectureImage = await Promise.all(
            lectureData.map(async (lecture) => {
                let imageUrl = null;

                try {
                    const imageRes = await fetch(`/lecture/imageLoding?lectureId=${lecture.recruitmentPostId}`);
                    const imageData = await imageRes.json();
                    imageUrl = imageData.mainUrl || "/img/default-thumbnail.png";
                } catch (e) {
                    imageUrl = "/img/default-thumbnail.png"; // 실패 시 기본 이미지
                }

                return {
                    ...lecture,
                    isWish: userWishList.includes(lecture.recruitmentPostId),
                    mainImageUrl: imageUrl
                };
            })
        );

        lectureImage.reverse();

        setLectures(lectureImage);

    };

    //검색 중 엔터키 누르면 검색 실행하는 함수
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchLectures(selectedCategory, keyword);
        }
    };

    useEffect(() => {
        fetch("/users/api/user/info")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setUserPrimaryId(data.user.userPrimaryId);
                    const userId = data.user.userPrimaryId;
                    fetch(`/api/mypage/mywish?userPrimaryId=${userId}`)
                        .then(res => res.json())
                        .then(wishData => {
                            const wishedIds = wishData.map(item => item.recruitmentPostId);
                            setUserWishList(wishedIds);
                        });
                }
            });
    }, []);

    useEffect(() => {
        fetchLectures(selectedCategory, keyword);
    }, [selectedCategory, userWishList]);

    return (
        <div className="LectureInfo-container">
            <section className="search-bar-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="원하는 서비스를 검색해보세요"
                        className="search-input"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <img className="search-button"
                         src="/img/search.png"
                         alt="검색"
                         onClick={() => fetchLectures(selectedCategory, keyword)}/>
                </div>
            </section>

            <div className="categories">
                {categories.map((cat, i) => (
                    <div className="category"
                        onClick={() => setSelectedCategory(cat.forQuery)}>
                        <img src={`/img/${cat.filename}.png`}
                             alt={cat.label}
                             data-category={cat.filename}
                        />
                        <span key={i} className="category">{cat.label}</span>
                    </div>
                ))}
            </div>

            <div className="lectures-cards" >
                {lectures.map((lecture, idx) => (
                    <div className="service-card"
                         key={idx}
                         onClick={() => window.location.href = `/lecture/lecturedetail?lectureId=${lecture.recruitmentPostId}`}
                    >

                        <div className="wishTopBox">
                            <div
                                className={`wish ${lecture.isWish ? 'wishHeart' : 'notWishHeart'}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if(!userPrimaryId) return alert("로그인이 필요합니다.");


                                    const updated = !lecture.isWish;
                                    const updatedLectures = [...lectures];
                                    updatedLectures[idx] = { ...lecture, isWish: updated };
                                    setLectures(updatedLectures);

                                    fetch('/api/mypage/updatewish', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            recruitmentPostId: lecture.recruitmentPostId,
                                            isWish: updated,
                                            userPrimaryId: userPrimaryId
                                        }),
                                    });
                                }}
                            >
                                <div>❤️</div>
                                <div>🤍</div>
                            </div>
                        </div>


                        {/*사진 수정해야 함*/}
                        <img src={lecture.mainImageUrl}
                             alt={lecture.recruitmentPostTitle} />
                        <div className="service-title">{lecture.recruitmentPostTitle}</div>
                        <div className="service-info">
                            {/*리뷰 관련 만들고 가져오기 만들어야 할듯.*/}
                            <span className="service-rating">★ 4.8</span>
                            {/*<span className="service-rating">★ {lecture.rating}</span>*/}
                            <span className="service-count"> | (158)</span>
                            {/*<span className="service-count"> | ({lecture.reviews})</span>*/}
                        </div>
                        <div className="service-meta">
                            <span className="service-price">{lecture.recruitmentPostPrice}원</span>
                            {/*강의 제공하는 고수 가져와야함*/}
                            {/*<span className="service-provider">{lecture.provider}</span>*/}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Header/>
        <LectureInfo />
        <Footer/>
    </>

);