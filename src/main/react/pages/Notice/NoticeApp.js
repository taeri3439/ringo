import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import NoticeList from "./NoticeList";

function NoticeApp() {

    return (
        <>
            <Header />
            <NoticeList />
            <Footer />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NoticeApp />);
