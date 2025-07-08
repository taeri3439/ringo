import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../first.css';
import './Community.css';
import MyHeader from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import dayjs from 'dayjs';

const categories = ["전체", "자유", "질문", "홍보"];


function Community() {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const postsPerPage = 5;

    // 페이지 번호 클릭
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchPosts = async (category, size, offset, keyword) => {
        const params = new URLSearchParams();
        params.append("category", category);
        params.append("size", size);
        params.append("offset", offset);
        if (keyword && keyword.trim() !== "") {
            params.append("search", keyword.trim());
        }

        const response = await fetch(`/community/getPost?${params.toString()}`);
        setPosts(await response.json());
    };

    const fetchPostsCount = async (category, keyword) => {
        const params = new URLSearchParams();
        params.append("category", category);
        if (keyword && keyword.trim() !== "") {
            params.append("search", keyword.trim());
        }

        const response = await fetch(`/community/getPostCount?${params.toString()}`);
        setTotalPages((await response.json() + postsPerPage - 1) / postsPerPage);
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            fetchPosts(selectedCategory, postsPerPage, 0, search);
            fetchPostsCount(selectedCategory, search);
        }
    };

    // 카테고리/검색 변경 시 1페이지로 이동
    useEffect(() => {
        fetchPosts(selectedCategory, postsPerPage, 0, search);
        setCurrentPage(1);
        fetchPostsCount(selectedCategory, search);
    }, [selectedCategory]);

    useEffect(() => {
        fetchPosts(selectedCategory, postsPerPage, (currentPage - 1) * postsPerPage, search);
    }, [currentPage]);

    return (
        <div className="board-container">
            <aside className="board-sidebar">
                <div className="sidebar-sticky">
                    <ul className="board-category-list">
                        {categories.map((cat) => (
                            <li
                                key={cat}
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                    <div className="btn-box">
                        <button className="board-write-btn"
                                onClick={() => window.location.href = "/community/communitywrite"}
                        >글쓰기</button>
                    </div>
                </div>

            </aside>
            <main className="board-main">
                <div className="board-header">
                    <h2>{selectedCategory}</h2>
                    <div className="board-search">
                        <input
                            type="text"
                            placeholder="키워드로 검색하세요."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>
                </div>
                <ul className="board-list">
                    {posts.map((post) => (
                        <li  key={post.postId}
                             onClick={() => window.location.href = `/community/communitydetail?postId=${post.postId}`}
                             className="board-list-item">
                            <div className="board-meta">
                                <span className="board-category">{post.postType}</span>
                            </div>
                            <div className="board-content">
                                <div className="board-title">{post.postTitle}</div>
                                <div className="board-desc">{post.postContent}</div>
                                <div className="board-info">
                                    <span className="board-comments">💬 {post.postCommentCount}</span>
                                    <span className="board-date">
                                        {dayjs(post.postCreateDate).format('YYYY-MM-DD')}
                                    </span>
                                </div>
                            </div>
                            {/*<div className="board-thumb">*/}
                            {/*    /!*<img src="/img/sample-thumb.png" alt="썸네일" />*!/*/}
                            {/*</div>*/}
                        </li>
                    ))}
                </ul>
                {/* 페이지네이션 */}
                <div className="pagination">
                    <button
                        className="page-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`page-btn${currentPage === i + 1 ? " active" : ""}`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="page-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>


            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <MyHeader/>
        <Community/>
        <Footer/>
    </>
);
