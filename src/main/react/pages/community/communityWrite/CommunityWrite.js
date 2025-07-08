import React, { useState, useRef, useEffect } from "react";
import '../../first.css';
import "./CommunityWrite.css";
import ReactDOM from "react-dom/client";
import MyHeader from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

const categories = ["자유", "질문", "홍보"];

// ul/li로 만든 커스텀 셀렉트 박스 컴포넌트
function CustomSelect({ value, onChange, options }) {
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
        <div className="select-wrapper" ref={wrapperRef}>
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

function CommunityWrite() {
    const [category, setCategory] = useState("자유");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const fileInputRef = useRef();

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
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("postTitle", title);
        formData.append("postContent", content);
        formData.append("postType", category);
        formData.append("userPrimaryId", 0); // TODO: 세션에서 가져오기

        // 이미지 파일들 추가
        images.forEach((image, index) => {
            formData.append("images", image);
        });

        try {
            const response = await fetch('/community/writepost', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("글이 등록되었습니다.");
                window.location.href="/community/communitylist";
            } else {
                alert("글 등록에 실패했습니다.");
            }
        }catch (e) {
            alert("에러발생" + e);
        }
    };

    return (
        <div className="upload-container">
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2 className="upload-title">글 쓰기</h2>
                <CustomSelect
                    value={category}
                    onChange={setCategory}
                    options={categories}
                />
                <input
                    className="upload-input"
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
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
        <CommunityWrite/>
        <Footer/>
    </>
);
