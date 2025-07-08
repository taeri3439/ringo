import React, {useEffect, useState} from 'react';
import './ProductDetailTop.css';
import ReactDOM from "react-dom/client";
import Header from "../../../../components/header/Header";
import Footer from "../../../../components/footer/Footer";
import ProductDetail from "../ProductDetail";


function ProductDetailTop({category, title, contactStartTime, contactEndTime, userPrimaryId, lectureId}) {

    const [userInfo, setUserInfo] = useState(null);
    const [profileImage, setProfileImage] = useState("");
    const [rightImage, setRightImage] = useState("");

    useEffect(() => {
        fetch(`/lecture/api/user/info/${userPrimaryId}`)
            .then(res => res.json())
            .then(data => {
                console.log("받아온 유저 데이터:", data);

                if (data.success) {
                    setUserInfo(data.user);
                    setProfileImage(
                        data.userProfileImage || "/img/profile_default.png"
                    );

                }
            });
    }, [userPrimaryId]);

    useEffect(() => {
        fetch(`/lecture/imageLoding?lectureId=${lectureId}`)
            .then(res => res.json())
            .then(data => {
            setRightImage(data.mainUrl || "/img/profile_default.png");
        })
    }, [lectureId])


    return (
        <>

            <div className="topBox">
                <div className="leftTop">
                    <div className="categoryName">{category}</div>
                    <div className="titleName">{title}</div>
                    <div className="scoreName">평점</div>
                    <div className="gosuProfile">
                        <div><img src={profileImage}
                                  alt="프로필이미지"/></div>
                        <div>
                            <div>{userInfo ? userInfo.userNickName : ""}</div>
                            <div>응답 가능 시간: {contactStartTime} ~ {contactEndTime}</div>
                        </div>
                        {/*  문의하기*/}
                        <div></div> 

                    </div>
                </div>
                <div className="rightTop">
                    <img src={rightImage}
                         alt="수업 썸네일" />
                </div>
            </div>
        </>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <ProductDetailTop />
//     </>
// );

export default ProductDetailTop;