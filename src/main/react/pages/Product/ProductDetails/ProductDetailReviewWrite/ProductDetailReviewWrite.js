import React, { useState, useRef, useEffect } from "react";
import "../../../first.css";
import "./ProductDetailReviewWrite.css";
import ReactDOM from "react-dom/client";
import Header from "../../../../components/header/Header";
import Footer from "../../../../components/footer/Footer";

function ProductDetailReviewWrite() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getQueryParam = (param) => {
        return new URLSearchParams(window.location.search).get(param);
    }

    const lectureId = getQueryParam("lectureId");

    // const [userInfo, setUserInfo] = useState(null);
    // const [profileImage, setProfileImage] = useState("/img/screen1.jpg");
    //
    // useEffect(() => {
    //     fetch(`/lecture/api/user/info/${userPrimaryId}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) {
    //                 setUserInfo(data.user);
    //                 setProfileImage(
    //                     data.user.userProfile && data.user.userProfileMimetype
    //                         ? `data:${data.user.userProfileMimetype};base64,${data.user.userProfile}`
    //                         : "/img/profile_default.png"
    //                 );
    //             }
    //         });
    // }, [userPrimaryId]);


    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/users/api/user/info', { credentials: 'include' })  // 쿠키 세션 포함
            .then(res => {
                if (res.status === 401) {
                    alert('로그인 후 이용해주세요.');
                    window.location.href = '/users/login';
                    return null;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.success) {
                    setUserInfo(data.user);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (!userInfo) return null;



    // 등록 버튼 클릭
    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            recruitmentReviewTitle: title,
            recruitmentReviewContent: content,
            // userPrimaryId: userInfo.userNickName, //이거 나중에 세션에서 받아오는 userId로 교체해야 함.
            // profileImage: userInfo.userProfileMimetype
            recruitmentReviewScore: 5,
            recruitmentPostId: lectureId
        };

        try {
            const response = await fetch('/lecture/lecturereviewwrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                alert("글이 등록되었습니다.");
                window.location.href=`/lecture/lecturedetail?lectureId=${lectureId}`; //체크 필요
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
        <Header/>
        <ProductDetailReviewWrite/>
        <Footer/>
    </>
);
