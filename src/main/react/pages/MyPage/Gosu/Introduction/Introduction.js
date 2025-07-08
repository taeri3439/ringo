import React, { useState, useEffect } from "react";
import './Introduction.css';
import ReactDOM from "react-dom/client";

function Introduction() {

    const [editMode, setEditMode] = useState(false);
    const [introTitle, setIntroTitle] = useState("");
    const [introContent, setIntroContent] = useState("");
    const [tempTitle, setTempTitle] = useState("");
    const [tempContent, setTempContent] = useState("");

    // 🔹 컴포넌트 마운트 시 서버에서 소개글 정보 fetch
    useEffect(() => {
        fetch("/users/api/user/info", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setIntroTitle(data.user.introductionTitle || "");
                    setIntroContent(data.user.introductionContent || "");
                }
            });
    }, []);

    const handleEdit = () => {
        setTempTitle(introTitle);
        setTempContent(introContent);
        setEditMode(true);
    };

    // 🔹 저장 버튼에서 서버로 소개글 저장
    const handleSave = () => {
        fetch("/users/api/user/introduction", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                introductionTitle: tempTitle,
                introductionContent: tempContent
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIntroTitle(tempTitle);
                    setIntroContent(tempContent);
                    setEditMode(false);
                    alert("소개글이 저장되었습니다!");
                } else {
                    alert(data.message || "저장 실패!");
                }
            });
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    return (
        <section className="section">
            <h2 className="section-title">소개</h2>
            <div className="introduction">
                <div className="introductionBox">
                    {editMode ? (
                        <>
                            <input
                                className="introductionTitle"
                                value={tempTitle}
                                onChange={e => setTempTitle(e.target.value)}
                                placeholder={"제목을 작성해주세요"}
                            />
                            <textarea
                                className="introductionTitleContent"
                                value={tempContent}
                                onChange={e => setTempContent(e.target.value)}
                                rows={6}
                                placeholder={"내용을 작성해주세요"}
                            />
                            <div className="button-group">
                                <button onClick={handleSave} className="modify-button">저장</button>
                                <button onClick={handleCancel} className="modify-button">취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="introductionTitle">{introTitle}</p>
                            <p className="introductionTitleContent">{introContent}</p>
                            <div className="button-group">
                                <button onClick={handleEdit} className="modify-button">수정</button>
                            </div>

                        </>
                    )}
                </div>

            </div>
        </section>
    )
}

export default Introduction;