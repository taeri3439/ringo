import React, { useEffect, useState } from "react";
import './MyStudyClass.css';

function MyStudyClass({ showAll = false, setActiveTab }) {
    const [myStudyClass, setMyStudyClass] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');

    const handleCardClick = async (recruitmentPostId) => {
        try {
            // recruitment_post_id로 roomId 조회
            const res = await fetch(`/findRoomIdByRecruitmentPostId?recruitment_post_id=${recruitmentPostId}`);
            const roomId = await res.text();

            if (!roomId) {
                alert("해당 수업에 연결된 방이 없습니다.");
                return;
            }

            // meeting.do로 이동 (아이디, 이름도 함께)
            window.location.href = `/meeting.do?roomId=${roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}`;
        } catch (err) {
            alert("방 정보 조회에 실패했습니다.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            //  로그인 유저 정보 요청
            const userRes = await fetch('/users/api/user/info', { credentials: 'include' });
            const userData = await userRes.json();
            if (!userData.success) {

                setLoading(false);
                return;
            }
            const userPrimaryId = userData.user.userPrimaryId;
            setUserId(userData.user.userId);
            setUserName(userData.user.userName);



            // 전체 개수 fetch
            const countRes = await fetch(`/api/mypage/mystudyclass/count?userPrimaryId=${userPrimaryId}`);
            const countData = await countRes.json();
            setTotalCount(countData.count);

            // 해당 유저의 수강중인 수업 목록 요청
            const url = showAll
                ? `/api/mypage/mystudyclass?userPrimaryId=${userPrimaryId}`
                : `/api/mypage/mystudyclass/latest3?userPrimaryId=${userPrimaryId}`;

            const classRes = await fetch(url);
            const classData = await classRes.json();
            setMyStudyClass(Array.isArray(classData) ? classData : []);
            setLoading(false);
        };

        fetchData();
    }, [showAll]);

    if (loading) return <div>로딩중...</div>;

    return (
        <section className="section">
            <h2 className="section-title">
                내가 수강중인 수업 <span className="section-total">Total {totalCount}</span>
            </h2>
            <div className="card-grid">
                {myStudyClass.map((myClass, index) => (
                    <div key={index} className="card"  onClick={() => handleCardClick(myClass.recruitmentPostId)}>
                        <div className="exampleImageBlack">
                            <img src={myClass.mainImageUrl || "/img/screen1.jpg"} alt="수업 이미지" />
                        </div>
                        <p className="card-title">{myClass.recruitmentPostTitle}</p>
                        <p className="card-desc">{myClass.recruitmentPostContent}</p>
                        {/*<p className="card-price">*/}
                        {/*    {myClass.classManageStartDate?.slice(2, 10)} ~ {myClass.classManageFinishDate?.slice(2, 10)}*/}
                        {/*</p>*/}
                    </div>


                ))}
                {totalCount > 3 && !showAll && (
                    <>
                        <div className="blank"></div>
                        <figure onClick={() => setActiveTab && setActiveTab("study")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyStudyClass;