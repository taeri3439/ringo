import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import './Main.css' //css파일 임포트

function Main() {

    return (
        <div>
            <h3 className="app">이것이 멀티 페이지 렌더링 방식의 리액트다.</h3>
        </div>

    )
}
//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main />
);
