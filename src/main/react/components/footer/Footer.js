import React from "react";
import "./Footer.css";

function Footer() {

    return (
        <div className="footer-container">
            <footer className="footer">
                <div className="footer-top">
                    <p className="footer-phone">1234-1234</p>
                    <p>운영시간 : 10:00~18:00 | 점심시간 : 12:00~13:00 (주말, 공휴일 제외)</p>
                    <p>FAX: 02-3455-5001 | Email: helpdesk@jobkorea.co.kr</p>
                    <p><a href="#">전자금융거래 이용약관</a> | <a href="#">개인정보처리방침</a> | <a href="#">위치기반서비스 이용약관</a></p>
                    <p>© JOBKOREA LLC. All rights reserved.</p>
                </div>
                <div className="footer-links">
                    <a href="#">회사소개</a>
                    <a href="#">이용약관</a>
                    <a href="#">고객센터</a>
                </div>
            </footer>
        </div>

    );
}

export default Footer;