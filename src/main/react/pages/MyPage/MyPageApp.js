import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import MyPageUser from "./User/MyPageUser";
import MyPageGosu from "./Gosu/MyPageGosu";

function MyPageApp() {
    const [mode, setMode] = useState("user"); // "user" 또는 "gosu"

    return (
        <>
            <Header />
            {mode === "user" && <MyPageUser onConvert={() => setMode("gosu")} />}
            {mode === "gosu" && <MyPageGosu onBack={() => setMode("user")} />}
            <Footer />
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MyPageApp />);
