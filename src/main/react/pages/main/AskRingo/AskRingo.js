import React from "react";
import "./AskRingo.css";

const postData = [
    {
        title: "[당첨자 발표] 최대 500만원, 원하는대로 지금 숨고해",
        description:
            "정말 많은 분들께서 숨고 이벤트에 관심을 가지고 참여해 주셨네요. 고중에서 큰 감동을 준 5명의...",
        views: "1,231",
        comments: "34",
        image: "/img/makeBlogThumbnail.png",
    },
    {
        title: "[당첨자 발표] 최대 500만원, 원하는대로 지금 숨고해",
        description:
            "정말 많은 분들께서 숨고 이벤트에 관심을 가지고 참여해 주셨네요. 고중에서 큰 감동을 준 5명의...",
        views: "1,231",
        comments: "34",
        image: "/img/makeBlogThumbnail.png",
    },
    {
        title: "[당첨자 발표] 최대 500만원, 원하는대로 지금 숨고해",
        description:
            "정말 많은 분들께서 숨고 이벤트에 관심을 가지고 참여해 주셨네요. 고중에서 큰 감동을 준 5명의...",
        views: "1,231",
        comments: "34",
        image: "/img/makeBlogThumbnail.png",
    },
];

const RingoSidebarAd = ({ image, title }) => (
    <div className="ringo-sidebar-ad">
        <img src={image} alt="ad" className="ringo-sidebar-image" />
        <h3 className="ringo-sidebar-title">{title}</h3>
    </div>
);

const RingoPostCard = ({ title, description, views, comments, image }) => (
    <div className="ringo-post-card">
        <div className="ringo-post-content">
            <span className="ringo-post-source">링고</span>
            <h2 className="ringo-post-title">{title}</h2>
            <p className="ringo-post-description">{description}</p>
            <div className="ringo-post-meta">
                <span>🔍 {views}</span>
                <span>💬 {comments}</span>
            </div>
        </div>
        <img src={image} alt="thumb" className="ringo-post-thumbnail" />
    </div>
);

export default function AskRingo() {
    return (
        <div className="ask-ringo-container">
            <h1 className="ask-ringo-heading">링고에게 물어보세요</h1>
            <div className="ask-ringo-flex">
                <div className="ask-ringo-posts">
                    {postData.map((item, idx) => (
                        <RingoPostCard key={idx} {...item} />
                    ))}
                </div>
                <div className="ask-ringo-sidebar">
                    <RingoSidebarAd
                        image="/img/ad1.png"
                        title="[당첨자 발표] 최대 500만원, 원하는대로 지금 숨고해"
                    />
                </div>
            </div>
        </div>
    );
}
