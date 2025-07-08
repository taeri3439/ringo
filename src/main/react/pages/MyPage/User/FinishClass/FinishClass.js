import React, { useEffect, useState } from "react";
import './FinishClass.css';

function FinishClass({ showAll = false, setActiveTab }) {
    const [myStudyClass, setMyStudyClass] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            // 로그인 유저 정보 요청
            const userRes = await fetch('/users/api/user/info', { credentials: 'include' });
            const userData = await userRes.json();
            if (!userData.success) {
                window.location.href = '/users/login';
                setLoading(false);
                return;
            }





            const userPrimaryId = userData.user.userPrimaryId;

            const countRes = await fetch(`/api/mypage/myfinishedclass/count?userPrimaryId=${userPrimaryId}`);
            const countData = await countRes.json();
            setTotalCount(countData.count);

            // 수강완료 목록 fetch
            const url = showAll
                ? `/api/mypage/myfinishedclass?userPrimaryId=${userPrimaryId}`
                : `/api/mypage/myfinishedclass/latest3?userPrimaryId=${userPrimaryId}`;

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
                내가 수강 완료한 수업 <span className="section-total">Total {totalCount}</span>
            </h2>
            <div className="card-grid">
                {myStudyClass.map((myClass, index) => (
                    <div key={index} className="card">
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
                        <figure onClick={() => setActiveTab && setActiveTab("finish")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
        </section>
    );
}

export default FinishClass;