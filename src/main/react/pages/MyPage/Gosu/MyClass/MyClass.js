import React, { useState, useEffect } from "react";
import './MyClass.css';
import RoomCreatePopup from "../Popup/RoomCreatePopup";
import PasswordPopup from "../Popup/PasswordPopup";

function MyClass({ showAll = false, setActiveTab }) {
    const [showPopup, setShowPopup] = useState(false);
    const [classes, setClasses] = useState([]);
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [userId, setUserId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [classToEdit, setClassToEdit] = useState(null);
    const [userName, setUserName] = useState('');

    const displayedClasses = showAll ? classes : classes.slice(0, 3);

    const fetchClasses = async () => {
        const res = await fetch('/api/classes', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        setClasses(data);
    };

    const handleEditClick = (classItem) => {
        setEditMode(true);
        setClassToEdit(classItem);
        setShowPopup(true);
    };

    const handleDeleteClick = async (classItem) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            const res = await fetch(`/api/classes/${classItem.roomId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setClasses(prev => prev.filter(c => c.roomId !== classItem.roomId));
            } else {
                alert("삭제 실패");
            }
        }
    };

    useEffect(() => {
        fetch("/users/api/user/info", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserId(data.user.userId);
                    setUserName(data.user.userName);
                } else {
                    alert("로그인이 필요합니다.");
                }
            });
    }, []);

    const handleCardClick = (classItem) => {
        if (classItem.password) {
            setSelectedClass(classItem);
            setShowPasswordPopup(true);
        } else {
            window.location.href = `/meeting.do?roomId=${classItem.roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}`;
        }
    };

    const handlePasswordSubmit = (enteredPassword) => {
        if (enteredPassword === selectedClass.password) {
            window.location.href = `/meeting.do?roomId=${selectedClass.roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}`;
        } else {
            alert("비밀번호가 틀렸습니다.");
            setShowPasswordPopup(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <section className="section">
            <h2 className="section-title">
                내가 수업중인 수업 <span className="section-total">Total {classes.length}</span>
            </h2>
            <div className="card-grid">
                {displayedClasses.map((classItem, i) => (
                    <div key={i} className="card" onClick={() => handleCardClick(classItem)}>
                        <div className="exampleImageBlack">
                            <img src={classItem.imageUrl} alt="class" />
                        </div>
                        <p className="card-title">{classItem.title}</p>
                        <p className="card-desc">{classItem.description}</p>
                        <p className="card-price">${classItem.price}</p>
                        <div className="card-actions">
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(classItem); }}>수정</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(classItem); }}>삭제</button>
                        </div>
                    </div>
                ))}
                {classes.length > 3 && !showAll && setActiveTab && (
                    <>
                        <div className="blank"></div>
                        <figure onClick={() => setActiveTab && setActiveTab("study")}>
                            <img src={"/img/right.png"} alt="더보기" />
                        </figure>
                    </>
                )}
            </div>
            <div className="makeClassBtn">
                <button className="roomBtn" onClick={() => setShowPopup(true)}>방 만들기</button>
            </div>
            {showPopup && (
                <RoomCreatePopup
                    onClose={() => {
                        setShowPopup(false);
                        setEditMode(false);
                        setClassToEdit(null);
                    }}
                    onClassCreate={(newClass) => setClasses(prev => [newClass, ...prev])}
                    editMode={editMode}
                    initialData={editMode ? classToEdit : {}}
                    onUpdate={(updatedClass) => {
                        setClasses(prev => prev.map(c => c.roomId === updatedClass.roomId ? updatedClass : c));
                    }}
                />
            )}
            {showPasswordPopup && (
                <PasswordPopup
                    onClose={() => setShowPasswordPopup(false)}
                    onSubmit={handlePasswordSubmit}
                />
            )}
        </section>
    );
}

export default MyClass;
