import React, {useState} from 'react';
import './ProductDetailBottomSideBar.css';
import ReactDOM from "react-dom/client";




function ProductDetailBottomSideBar({title, price, priceBasis, weeklySessions, sessionDuration, contactStartTime, contactEndTime, responseTime}) {

    const getQueryParam = (param) => {
        return new URLSearchParams(window.location.search).get(param);
    }
    const lectureId = getQueryParam("lectureId");

    // 2. 상담신청하기 버튼 클릭 시 실행될 함수
    const handleEnroll = async () => {
        // 로그인 유저 정보 요청
        const userResponse = await fetch('/users/api/user/info', { credentials: 'include' });
        const userData = await userResponse.json();
        if (!userData.success) {
            alert("로그인이 필요합니다.");
            return;
        }
        const userPrimaryId = userData.user.userPrimaryId;

        // 신청 API 호출
        const payload = {
            classManageStatus: "수업중",
            recruitmentPostId: lectureId,
            userPrimaryId: userPrimaryId
        };

        const enrollResponse = await fetch('/lecture/enroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        if (enrollResponse.ok) {
            alert("신청이 완료되었습니다!");
        } else if (enrollResponse.status === 409) {
            const msg = await enrollResponse.text();
            alert(msg); // "이미 수강중인 수업입니다."
        } else {
            alert("신청에 실패했습니다.");
        }
    };


    return (
        <>

            <div className="rightBottom">
                <p>{title}</p>
                <div>
                    <span>{price}원</span>
                    <span>{priceBasis} 당</span>
                </div>

                <div>
                    <span>{sessionDuration}시간</span>
                    <span>주 {weeklySessions}회</span>
                </div>


                <div>
                    <span>상담 가능 시간</span>
                    <span>{contactStartTime}~{contactEndTime}</span>
                </div>

                <div>
                    <span>평균 응답 시간</span>
                    <span>{responseTime}</span>
                </div>


                <div>
                    <button className="enroll-btn" onClick={handleEnroll}>
                    수강신청하기
                    </button>
                </div>
            </div>
        </>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <ProductDetailBottomSideBar />
//     </>
// );

export default ProductDetailBottomSideBar;