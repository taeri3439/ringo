import React, { useState, useEffect } from 'react';
import './MyPageUser.css';
import ReactDOM from "react-dom/client";
import LeftBar from "./LeftBar/LeftBar";
import MyStudyClass from "./MyStudyClass/MyStudyClass";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import MyBookmark from "./MyBookmark/MyBookmark";
import MyReview from "./MyReview/MyReview";
import Timetable from "./Timetable/Timetable";
import Example from "./Timetable/example";
import FinishClass from "./FinishClass/FinishClass";


export default function MyPageUser({onConvert}) {
    const [activeTab, setActiveTab] = useState("home");
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch('/users/api/user/info', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.success) setIsAuthenticated(true);
                else window.location.href = "/users/login";
                setLoading(false);
            });
    }, []);

    if (loading) return null; // 또는 로딩 스피너

    if (!isAuthenticated) return null; // 인증 안됐으면 아무것도 안 보여줌

    if (loading) return null; // 또는 로딩 스피너

    if (!isAuthenticated) return null; // 로그인 안됐으면 아무것도 렌더링하지 않음



    return (
        <div className="container">
            <div className="content-wrapper">
                {/* Sidebar */}
                <LeftBar activeTab={activeTab} setActiveTab={setActiveTab} onConvert={onConvert} />

                {/* Main Content */}
                <main className="main">

                    {activeTab === "home" &&
                        <>
                            <MyStudyClass showAll={false} setActiveTab={setActiveTab} />
                            <FinishClass showAll={false} setActiveTab={setActiveTab}/>
                            <MyBookmark showAll={false} setActiveTab={setActiveTab}/>
                            <MyReview showAll={false} setActiveTab={setActiveTab}/>
                            <Timetable />
                        </>
                    }
                    {activeTab === "study" &&
                        <MyStudyClass showAll={true} />
                    }
                    {activeTab === "bookmark" &&
                     // 내가 찜한 수업
                    <MyBookmark showAll={true} />
                    }
                    {activeTab === "review" &&
                     // 내가 작성한 리뷰
                    <MyReview showAll={true} />
                    }
                    {activeTab === "timetable" &&
                        // 시간표
                    <Timetable />
                    }
                    {activeTab === "finish" &&
                        // 수강완료
                    <FinishClass showAll={true}/>
                    }

                    {/*<Example />*/}


                </main>
            </div>
        </div>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <Header />
//         <MyPageUser />
//         <Footer />
//     </>
// );