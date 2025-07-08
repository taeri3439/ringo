import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import QnaList from "./QnaList";

function QnaApp() {

    return (
        <>
            <Header />
            <QnaList />
            <Footer />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<QnaApp />);
