import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import '../../first.css';
import './ProductRegistration.css';
import MyHeader from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";


const categories = ['디자인', 'it·프로그래밍', '영상·사진', '마케팅', '주식·코인', '문서·글쓰기', '세무·법인·노무', '창업·사업', '기타'];

// ul/li로 만든 커스텀 셀렉트 박스 컴포넌트
function CustomSelect({ value, onChange, options, className = "" }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className={`select-wrapper ${className}`} ref={wrapperRef}>
            <div
                className="custom-select-label"
                onClick={() => setOpen((v) => !v)}
                tabIndex={0}
            >
                {value}
                <img
                    src="/img/down-arrow.png"
                    alt="화살표"
                    className={`select-arrow${open ? " open" : ""}`}
                />
            </div>
            <ul className={`custom-select-options${open ? " open" : ""}`}>
                {options.map((cat) => (
                    <li
                        key={cat}
                        className={cat === value ? "selected" : ""}
                        onClick={() => {
                            onChange(cat);
                            setOpen(false);
                        }}
                    >
                        {cat}
                    </li>
                ))}
            </ul>
        </div>
    );
}


function formatPriceInput(value) {
    // 숫자 이외 모두 제거
    const digitsOnly = value.replace(/[^0-9]/g, '');
    if (!digitsOnly) return '';
    // 1000단위 콤마 추가
    return Number(digitsOnly).toLocaleString();
}


function ProductRegistration() {
    const [category, setCategory] = useState("카테고리를 선택해주세요");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const fileInputRef = useRef();
    const [mainImage, setMainImage] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);
    const mainInputRef = useRef();
    const [weekValue, setWeekValue] = useState('협의가능');
    const [dayValue, setDayValue] = useState('협의가능');
    const [price, setPrice] = useState('');
    const [priceType, setPriceType] = useState('1시간');
    const [contactTime, setContactTime] = useState('');
    const [responseTime, setResponseTime] = useState('');
    const [avgResponseTime, setAvgResponseTime] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        fetch('/users/api/user/info', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserInfo(data.user);
                }
            });
    }, []);

    useEffect(() => {
        if (priceType === "협의가능") {
            setPrice("");
        }
    }, [priceType]);

    // 대표 이미지 업로드 핸들러
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            setMainPreview(URL.createObjectURL(file));
        }
    };

    // 대표 이미지 삭제
    const handleRemoveMainImage = () => {
        setMainImage(null);
        setMainPreview(null);
        mainInputRef.current.value = "";
    };

    // 드래그 오버/드롭 핸들러 추가
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith("image/")
        );
        if (images.length + files.length > 5) {
            alert("이미지는 최대 5개까지 업로드 가능합니다.");
            return;
        }
        setImages([...images, ...files.slice(0, 5 - images.length)]);
    };

    // 이미지 업로드 핸들러 (최대 5장)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert("이미지는 최대 5개까지 업로드 가능합니다.");
            return;
        }
        setImages([...images, ...files.slice(0, 5 - images.length)]);
        fileInputRef.current.value = "";
    };

    // 이미지 미리보기 URL 생성
    const getImagePreviews = () =>
        images.map((file) => URL.createObjectURL(file));

    // 이미지 삭제
    const handleRemoveImage = (idx) => {
        setImages(images.filter((_, i) => i !== idx));
    };

    // 등록 버튼 클릭
    const handleSubmit = (e) => {
        e.preventDefault();
        // const data = {
        //     recruitmentPostTitle: title,
        //     recruitmentPostContent: content,
        //     recruitmentPostCategory: category,
        //     recruitmentPostWeeklySessions: weekValue,
        //     recruitmentPostSessionDuration: dayValue,
        //     recruitmentPostPrice: price.replace(/,/g, ''),
        //     recruitmentPostPriceBasis: priceType,
        //     recruitmentPostContactStartTime: contactTime,
        //     recruitmentPostContactEndTime: responseTime,
        //     recruitmentPostAvgResponseTime: avgResponseTime,
        //     userPrimaryId: userInfo.userPrimaryId,
        // };

        const formData = new FormData();
        formData.append("recruitmentPostTitle", title);
        formData.append("recruitmentPostContent", content);
        formData.append("recruitmentPostCategory", category);
        formData.append("recruitmentPostWeeklySessions", weekValue);
        formData.append("recruitmentPostSessionDuration", dayValue);
        formData.append("recruitmentPostPrice", price.replace(/,/g, ''));
        formData.append("recruitmentPostPriceBasis", priceType);
        formData.append("recruitmentPostContactStartTime", contactTime);
        formData.append("recruitmentPostContactEndTime", responseTime);
        formData.append("recruitmentPostAvgResponseTime", avgResponseTime); // 상태값에서 받아와야 함
        formData.append("userPrimaryId", userInfo.userPrimaryId);

        // 이미지 파일들 추가
        images.forEach((image) => {
            formData.append("images", image);
        });

        formData.append("mainImage", mainImage);

        fetch('/lecture/writeRecruitmentPost', {
            method: 'POST',
            body: formData
        })
            .then(res => res.text()) // <-- 여기!
            .then(result => {
                if (result === "게시글 등록 성공") {
                    alert('글이 등록되었습니다!');
                    window.location.href = '/lecture/lectureinfo';
                    // 폼 초기화 등 추가
                } else {
                    alert('등록 실패: ' + result);
                }
            })
            .catch(err => {
                alert('등록 실패');
                console.log(err);
            });

    };

    return (
        <div className="upload-container">
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2 className="upload-title">상품 등록</h2>
                <input
                    className="upload-input"
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <CustomSelect
                    value={category}
                    onChange={setCategory}
                    options={categories}
                    className="category-select"
                />

                {/* 대표 이미지 등록 영역 */}
                <div
                    className="main-image-upload-area"
                    onClick={() => mainInputRef.current.click()}
                    tabIndex={0}
                    style={{ marginBottom: 24 }}
                >
                    {mainPreview ? (
                        <div style={{ width: "100%", height: "100%", position: "relative" }}>
                            <img
                                src={mainPreview}
                                alt="대표 이미지"
                                className="main-image-preview"
                            />
                            <button
                                type="button"
                                className="main-image-remove"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleRemoveMainImage();
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <div className="main-image-placeholder">
                            <img
                                src="/img/main_camera.png"
                                alt="카메라"
                                className="camera-icon"
                            />
                            <div className="placeholder-text">대표이미지 등록</div>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={mainInputRef}
                        style={{ display: "none" }}
                        onChange={handleMainImageChange}
                    />
                </div>

                <textarea
                    className="upload-textarea"
                    placeholder="내용을 입력하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={9}
                />
                <div className="upload-img-count">
                    {images.length}/5
                </div>
                <div
                    className="upload-img-dropzone"
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <span className="upload-img-icon">📄</span>
                    <span className="upload-img-text">
                        첨부할 이미지 파일을 올려주세요.<br />
                        이미지는 5개까지 업로드 가능합니다.<br />
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        disabled={images.length >= 5}
                    />
                </div>
                {/* 이미지 미리보기 및 삭제 */}
                <div className="upload-img-preview">
                    {getImagePreviews().map((src, idx) => (
                        <div key={idx} className="upload-img-thumb">
                            <img src={src} alt={`첨부이미지${idx + 1}`} />
                            <button
                                type="button"
                                className="upload-img-remove"
                                onClick={() => handleRemoveImage(idx)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                {/* === 여기부터 수업 일정 및 가격 영역 추가 === */}
                <div className="lesson-info-section">
                    <div className="lesson-info-title">수업 일정 및 가격</div>
                    <div className="lesson-info-row">
                        <span style={{ marginRight: "22px" }}>주</span>
                        <CustomSelect
                            value={weekValue}
                            onChange={setWeekValue}
                            options={['협의가능', '1', '2', '3', '4', '5', '6', '7']}
                            className="lesson-select"
                        />
                        <span style={{ marginRight: "48px" }}>회</span>
                        <p style={{ marginRight: "10px" }}>일</p>
                        <CustomSelect
                            value={dayValue}
                            onChange={setDayValue}
                            options={['협의가능', '1', '2', '3', '4', '5', '6', '7' , '8', '9', '10' , '11' , '12']}
                            className="lesson-select"
                        />
                        <p>시간</p>
                    </div>
                    <div className="lesson-info-row">
                        <span>가격</span>
                        <input
                            className="lesson-price-input"
                            type="text"
                            placeholder="가격을 입력하세요"
                            value={price}
                            onChange={e => setPrice(formatPriceInput(e.target.value))}
                            autoComplete="off"
                            disabled={priceType === "협의가능"}
                        />
                        <span>원</span>
                        <label className="custom-radio">
                            <input
                                type="radio"
                                name="priceType"
                                value="1시간"
                                checked={priceType === "1시간"}
                                onChange={e => setPriceType(e.target.value)}
                            />
                            <span className="radio-visual"></span>
                            1시간 기준
                        </label>
                        <label className="custom-radio">
                            <input
                                type="radio"
                                name="priceType"
                                value="1회"
                                checked={priceType === "1회"}
                                onChange={e => setPriceType(e.target.value)}
                            />
                            <span className="radio-visual"></span>
                            1회 기준
                        </label>
                        {/* 협의가능 버튼 */}
                        {/*<label className="custom-radio">*/}
                        {/*    <input*/}
                        {/*        type="radio"*/}
                        {/*        name="priceType"*/}
                        {/*        value="협의가능"*/}
                        {/*        checked={priceType === "협의가능"}*/}
                        {/*        onChange={e => setPriceType(e.target.value)}*/}
                        {/*    />*/}
                        {/*    <span className="radio-visual"></span>*/}
                        {/*    협의가능*/}
                        {/*</label>*/}
                    </div>

                    <div className="lesson-info-row">
                        <span>연락 가능 시간</span>
                        <input
                            className="contact-time-input"
                            type="time"
                            value={contactTime}
                            onChange={e => setContactTime(e.target.value)}
                            style={{ width: 120, marginRight: 12 }}
                            required
                        />
                        <span>~</span>
                        <input
                            className="contact-time-input"
                            type="time"
                            value={responseTime}
                            onChange={e => setResponseTime(e.target.value)}
                            style={{ width: 120, marginLeft: 12 }}
                            required
                        />
                        <span style={{ marginLeft: 24 }}>평균 응답시간</span>
                        <input
                            className="response-time-input"
                            type="text"
                            value={avgResponseTime}
                            onChange={e => setAvgResponseTime(e.target.value)}
                            placeholder="예: 1시간 이내"
                            style={{ width: 140, marginLeft: 8 }}
                            required
                        />
                    </div>

                </div>

                <button className="upload-submit-btn" type="submit">
                    등록
                </button>
            </form>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <ProductRegistration/>
        <Footer/>
    </>
);
