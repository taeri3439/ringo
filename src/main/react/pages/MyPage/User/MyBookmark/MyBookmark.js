import React, { useEffect, useState} from "react";
import './MyBookmark.css';
import ReactDOM from "react-dom/client";

function MyBookmark({ showAll = false, setActiveTab }) {
    const [myBookmarks, setMyBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPrimary, setUserPrimary] = useState(null);

    useEffect(() => {
        fetch('/users/api/user/info')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUserPrimary(data.user.userPrimaryId)

                    const user = data.user;
                    fetch(`/api/mypage/mywish?userPrimaryId=${user.userPrimaryId}`)
                        .then(res => res.json())
                        .then(data => {
                            setMyBookmarks(data);
                            setLoading(false);
                        })
                        .catch(err => {
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            })
            .catch(error => {
                setLoading(false);
            });
    }, []);

    const displayedBookmarks = showAll ? myBookmarks : myBookmarks.slice(0, 3);

    if (loading) return <div>로딩중...</div>;


//     return (
//         <section className="section">
//             <h2 className="section-title">내가 찜한 수업 <span className="section-total">Total {myBookmarks.length}</span></h2>
//             <div className="card-grid">
//
//                 {myBookmarks.map((myBookmark, index) => (
//
//                     console.log('typeof isWish:', typeof myBookmark.isWish, 'value:', myBookmark.isWish);
//                     return (
//
//                     <div key={index} className="card">
//                         <div className="exampleImageBlack">
//                             <div className={`wish ${Boolean(myBookmark.isWish) ? 'wishHeart' : 'notWishHeart'}`}>
//                                 <div>❤️</div>
//                                 <div>🤍</div>
//                             </div>
//                         </div>
//                         <p className="card-title">{myBookmark.recruitmentPostTitle}</p>
//                         <p className="card-desc">{myBookmark.recruitmentPostContent}</p>
//                         <p className="card-price">{myBookmark.recruitmentPostSystime?.slice(0,10)}</p>
//                     </div>
//
//                 );
//             })}
//             </div>
//         </section>
//     )
// }


    return (
        <section className="section">
            <h2 className="section-title">
                내가 찜한 수업 <span className="section-total">Total {myBookmarks.length}</span>
            </h2>
            <div className="card-grid">

                {displayedBookmarks.map((myBookmark, index) => (
                    <a
                        key={index}
                        href={`/lecture/lecturedetail?lectureId=${myBookmark.recruitmentPostId}`}
                        className="card-link"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div className="card">
                            <div className="exampleImageBlack">
                                <img
                                    src={myBookmark.mainImageUrl || "/img/screen1.jpg"}
                                    alt="수업 이미지"
                                />
                                <div
                                    className={`wish ${myBookmark.isWish === true || myBookmark.isWish === 'true' ? 'wishHeart' : 'notWishHeart'}`}
                                    onClick={e => {
                                        e.preventDefault(); // 상세페이지 이동 막기
                                        e.stopPropagation(); // 부모로 이벤트 전달 막기

                                        if(!userPrimary) return alert("로그인이 필요합니다.");


                                        const updatedWish = !myBookmark.isWish;
                                        const newBookmarks = [...myBookmarks];

                                        newBookmarks[index] = {
                                            ...myBookmark,
                                            isWish: updatedWish,
                                        };
                                        setMyBookmarks(newBookmarks);

                                        fetch('/api/mypage/updatewish', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                userPrimaryId: userPrimary,
                                                recruitmentPostId: myBookmark.recruitmentPostId,
                                                isWish: updatedWish,
                                            }),
                                        });
                                    }}
                                >
                                    <div>❤️</div>
                                    <div>🤍</div>
                                </div>
                            </div>
                            <p className="card-title">{myBookmark.recruitmentPostTitle}</p>
                            <p className="card-desc">{myBookmark.recruitmentPostContent}</p>
                            <p className="card-price">{myBookmark.recruitmentPostSystime?.slice(0, 10)}</p>
                        </div>
                    </a>
                ))}
                {myBookmarks.length > 3 && !showAll && setActiveTab && (
                    <>
                        <div className="blank"></div>
                        <figure onClick={() => setActiveTab("bookmark")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyBookmark;