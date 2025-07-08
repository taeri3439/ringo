// Gosu.js
import React from "react";
import "./Gosu.css";

const Gosu = () => (
    <div className="gosu-root">
        <div className="gosu-inner">
            <div className="gosu-left">
                <div className="gosu-title">
                    전문가로 활동하시나요?<br />
                    링고에서 당신의 능력을<br />
                    펼쳐보세요.
                </div>
                <button className="gosu-btn">고수가입</button>
            </div>
            <div className="gosu-right">
                <img src="/img/leftArrow.png" alt="왼쪽 화살표" className="gosu-arrow gosu-arrow-left" />
                <div className="gosu-card">
                    <img
                        className="gosu-card-img"
                        src="/img/gosu-card-example.png"
                        alt="고수 제안 예시"
                    />
                    <div className="gosu-card-desc">
                        조건이 맞는 고객에게 제안을 보내세요!
                    </div>
                </div>
                <img src="/img/rightArrow.png" alt="왼쪽 화살표" className="gosu-arrow gosu-arrow-left" />
            </div>
        </div>
    </div>
);

export default Gosu;
