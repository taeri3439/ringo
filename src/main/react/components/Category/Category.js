import React from "react";
import "./Category.css";

const categories = [
    { label: "디자인", filename: "design"},
    { label: "IT•프로그래밍", filename: "programming"},
    { label: "영상•사진", filename: "photo"},
    { label: "마케팅", filename: "marketing"},
    { label: "주식•코인", filename: "invest"},
    { label: "문서•글쓰기", filename: "document"},
    { label: "세무•법인•노무", filename: "tax"},
    { label: "창업•사업", filename: "business"},
    { label: "전체보기", filename: "all"}
]

function Category() {

    return(
        <div className="categories">
            {categories.map((cat, i) => (
                <div className="category">
                    <img src={`/img/${cat.filename}.png`}
                         alt={cat.label}
                         data-category={cat.filename}
                    />
                    <span key={i} className="category">{cat.label}</span>
                </div>
            ))}
        </div>
    );
}

export default Category;
