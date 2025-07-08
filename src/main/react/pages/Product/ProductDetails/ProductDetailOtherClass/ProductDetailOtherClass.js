import React, {useState, useEffect} from "react";
import './ProductDetailOtherClass.css';
import ReactDOM from "react-dom/client";

function ProductDetailOtherClass({userPrimaryId, currentPostId}) {

    const [otherClasses, setOtherClasses] = useState([]);

    useEffect(() => {
        if (!userPrimaryId || !currentPostId) return;

        fetch(`/lecture/other?userPrimaryId=${userPrimaryId}&excludePostId=${currentPostId}`)
            .then(res => res.json())
            .then(data => setOtherClasses(data))
            .catch(err => console.error("고수의 다른 수업 불러오기 실패", err));
    }, [userPrimaryId, currentPostId]);

    if (!otherClasses.length) return null;

    return (

        // <section className="section">
        //     <h2 className="section-title">고수의 다른 수업</h2>
        //     <div className="card-grid">
        //         {[...Array(3)].map((_, i) => (
        //             <div key={i} className="card">
        //                 <div className="exampleImageBlack"><img src={"/img/screen1.jpg"} /></div>
        //                 <p className="card-title">Java Advanced Part.{i + 1}</p>
        //                 <p className="card-desc">김영한의 실전 자바 - 고급 {i + 1}편, ...</p>
        //                 <p className="card-price">$59.40</p>
        //             </div>
        //         ))}
        //     </div>
        // </section>

        <section className="section">
            <h2 className="section-title">고수의 다른 수업</h2>
            <div className="card-grid">
                {otherClasses.map((item, index) => (
                    <a
                        key={index}
                        href={`/lecture/lecturedetail?lectureId=${item.recruitmentPostId}`}
                        className="card-link"
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        <div className="card">
                            <div className="ImageBlackBox">
                                <figure>
                                    <img src={item.imgUrl || "/img/screen1.jpg"}
                                         alt="수업 썸네일"/>
                                </figure>

                            </div>
                            <p className="card-title">{item.recruitmentPostTitle}</p>
                            <p className="card-desc">{item.recruitmentPostContent}</p>
                            <p className="card-price">{item.userNickName}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>

    )
}

export default ProductDetailOtherClass;