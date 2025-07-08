import React, {useState} from 'react';
import './MyPageGosu.css';
import ReactDOM from "react-dom/client";
import LeftBar from "./LeftBar/LeftBar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import MyClass from "./MyClass/MyClass";
import MyClassReview from "./MyClassReview/MyClassReview";
import Introduction from "./Introduction/Introduction";
import MyStudyClass from "../User/MyStudyClass/MyStudyClass";
import MyBookmark from "../User/MyBookmark/MyBookmark";
import MyReview from "../User/MyReview/MyReview";
import Timetable from "../User/Timetable/Timetable";



export default function MyPageGosu({onBack}) {
    const [activeTab, setActiveTab] = useState("home");

    return (
        <div className="container">
            <div className="content-wrapper">
                {/* Sidebar */}
                <LeftBar activeTab={activeTab} setActiveTab={setActiveTab} onBack={onBack} />

                {/* Main Content */}
                <main className="main">

                    {activeTab === "home" &&
                        <>
                            <Introduction />
                            <MyClass showAll={false} setActiveTab={setActiveTab} />
                            <MyClassReview showAll={false} setActiveTab={setActiveTab} />
                            <Timetable />
                        </>
                    }
                    {activeTab === "intro" &&
                        // 소개글
                        <Introduction />
                    }
                    {activeTab === "study" &&
                        // 내 수업
                        <MyClass  showAll={true}/>
                    }
                    {activeTab === "review" &&
                        // 내 수업 리뷰
                        <MyClassReview showAll={true} />
                    }
                    {activeTab === "timetable" &&
                        // 시간표
                        <Timetable />
                    }

                </main>
            </div>
        </div>
    );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <>
//         <Header />
//         <MyPageGosu />
//         <Footer />
//     </>
// );