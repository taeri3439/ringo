import React, { useState, useEffect } from 'react'; // useState와 useEffect를 import합니다.
import ReactDOM from 'react-dom/client';
import '../first.css';
import './IdFindGood.css'; // 이 파일의 CSS는 그대로 유지됩니다.
import MyHeader from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function IdFindGood() {

    const [userData, setUserData] = useState({ userName: '', idList: [] });

    useEffect(() => {
        // sessionStorage에서 'foundUserData' 키로 저장된 데이터를 가져옵니다.
        const foundDataString = sessionStorage.getItem('foundUserData');

        if (foundDataString) {
            const foundData = JSON.parse(foundDataString);

            setUserData(foundData);
            // 데이터를 사용한 후에는 sessionStorage에서 삭제

            sessionStorage.removeItem('foundUserData');
        } else {

            alert('잘못된 접근입니다. 아이디 찾기를 다시 시도해주세요.');
            window.location.href = '/users/idfind';
        }
    }, []);

    return (

        <div className="background">
            <div className="box">
                <div className="title">
                    <h1>아이디 찾기</h1>

                    <p>{userData.userName}님의 아이디 찾기가 완료 되었습니다.</p>
                    <p>가입한 아이디가 <span className="count">총 {userData.idList.length}개</span> 있습니다.</p>
                </div>
                <div className="id-list-container">
                    <ul className="id-list">
                        <li className="id-list-header">
                            <span className="id-label">아이디</span>
                            <span className="date-label">가입일</span>
                        </li>

                        {userData.idList.map((item, idx) => (
                            <li key={item.id + idx}>
                                <span className="user-id">{item.id}</span>
                                <span className="join-date">
                                  {item.date ? item.date.substring(0, 10) : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="signup">

                    <button type="button" className="login_button" onClick={() => window.location.href='/users/login'}>
                        로그인
                    </button>
                    <button type="button" className="pwchange_button" onClick={() => window.location.href='/users/pwchange'}>
                        비밀번호 찾기
                    </button>
                </div>
            </div>
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <IdFindGood/>
        <Footer/>
    </>
);
