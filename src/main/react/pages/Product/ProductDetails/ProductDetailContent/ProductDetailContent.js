import React, {useEffect, useState} from 'react';
import './ProductDetailContent.css';
import ReactDOM from "react-dom/client";

import ProductDetail from "../ProductDetail";


function ProductDetailContent({content, lectureId}) {
    const [contentImage, setContentImage] = useState([]);

    useEffect(() => {
        fetch(`/lecture/imageLoding?lectureId=${lectureId}`)

            .then(res => res.json())
            .then(data => {
                console.log("받아온 유저 url데이터:", data);
                setContentImage(data.notMainUrl || []);
            })
    }, [lectureId])

    return (
        <>

            <div>
                {/*여기 root 들어가고 서비스랑 리뷰 둘이 왔다갔다 하게*/}
                <div className="leftService">
                    {content}


                </div>

                <div className="contentImageGroup">
                    {contentImage.map((url,index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`상세 이미지 ${index = 1}`}
                            className="detailImage"

                        />
                    ))}

                </div>
                
            </div>

        </>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <ProductDetailContent />
//     </>
// );

export default ProductDetailContent;