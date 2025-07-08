import React from "react";
import ReactDOM from 'react-dom/client';

function User() {

    return (
        <div>
            <h3>유저페이지 입니다</h3>
            <p>번들 파일 바뀌나?</p>
            <p>123123</p>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <User />
);