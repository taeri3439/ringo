import React from 'react';
import ReactDOM from 'react-dom/client';
import './Main.css'; // CSS 파일을 import
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Interest from "./Interest/Interest";
import Hero from "./Hero/Hero";
import Category from "../../components/Category/Category";
import HighScoreService from "./HighScoreService/HighScoreService";
import PopularService from "./PopularService/PopularService";
import PopularGosu from "./PopularGosu/PopularGosu";
import AskRingo from "./AskRingo/AskRingo";
import Gosu from "./Gosu/Gosu";


function Main() {
    return (
        <div className="main-container">
            {/* Hero Section */}
            <Hero />

            {/* Categories */}
            <Category />

            {/* Interests Section */}
            <Interest />

            {/* HighScoreService Section */}
            <HighScoreService />

            {/* 지금 인기 있는 서비스 섹션 */}
            <PopularService />

            {/* 지금 인기 있는 고수 섹션 */}
            <PopularGosu/>

            {/* 링고에게 물어보세요 섹션 */}
            <AskRingo/>

            {/* 전문가 활동 유도 섹션 */}
            <Gosu/>

        </div>

    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Header />
        <Main />
        <Footer />
    </>
);
