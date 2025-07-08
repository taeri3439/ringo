import React, { useState } from "react";
import "./QnaWrite.css";
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import ReactDOM from "react-dom/client";
import NoticeList from "../Notice/NoticeList";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";


export default function QnaWrite() {

    return (

        <div id="wrap">
            <header className="imgbox">
                <div className="imgbox_title">
                    <div className="imgbox_inner">
                        <p className="oneToOneQna">1:1 고객 게시판</p>
                        <p className="title_Board">Board</p>
                    </div>
                </div>
            </header>
            <section className="qna_write_page">
                <div className="write_pagebox">
                    <div className="qna_write_page_inner">
                        <div className="qna_write_page_inner_title">1:1 문의</div>
                        <div className="qna_write_page_inner_mid">
                            <p className="leftbox">문의하기</p>
                            <p className="rightbox">고객님께서 소중한 의견을 작성해주시면 문의주신 내용을 바탕으로 답변해드리겠습니다. </p>
                        </div>
                        <div className="qna_write_page_inner_form">

                            <form action="/qna/qnaForm" method="post">
                                <div className="formUpper">
                                    <p className="qnaTitleWrap"><span className="pilsoo">*</span>제목</p>
                                    <input type="text" className="qnaTitle" name="postTitle"
                                           placeholder="제목을 입력해 주세요" required/><br/>
                                </div>
                                <div className="formMid">
                                    <p className="qnaContentWrap"><span className="pilsoo">*</span>내용</p>
                                    <textarea className="qnaContent" name="postContent"
                                              placeholder="내용을 입력해주세요"></textarea><br/>
                                </div>
                                <input type="submit" value="등록" className="qnaSubmitBtn"/>
                            </form>

                        </div>
                    </div>
                </div>
            </section>
        </div>


    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Header />
        <QnaWrite />
        <Footer />
    </>
);
