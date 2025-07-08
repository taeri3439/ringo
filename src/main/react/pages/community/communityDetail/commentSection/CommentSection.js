import React, {useEffect, useState} from "react";
import Comment from "../comment/Comment"
import './CommentSection.css';

// 댓글 전체 관리 컴포넌트
function CommentSection({postId, postAuthor}) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    //해당 post의 모든 댓글을 가져오기
    const fetchGetAllComments = async (postId) => {
        const response = await fetch(`/community/getAllParentComments?postId=${postId}`);
        setComments(await response.json());
    }

    useEffect(() => {
        fetchGetAllComments(postId);
    }, []);

    // 최상위 댓글 등록
    const handleAddComment = async() => {
        if (!newComment.trim()) return;
        //db에 댓글 저장하기
        //댓글 내용, 댓글 깊이, 부모 댓글 아이디, 작성글 아이디, 유저 아이디(세션에서 가져와야함)
        console.log(postId);
        const commentData = {
            commentContent: newComment,
            commentDepth: 0,
            postId: postId,
            userPrimaryId: 0 //나중에 현재 세션 userId로 바꿔줘야 함
        }

        try {
            await fetch('/community/writeComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
        }catch (e) {
            alert("에러발생" + e);
        }

        setNewComment("");
        await fetchGetAllComments(postId);
    };

    // 답글 등록 (트리 구조 갱신)
    const handleReply = async (parentId, text) => {

        const newReply = {
            commentContent: text,
            commentDepth: 1,
            postId: postId,
            commentParentId: parentId,
            userPrimaryId: 0 //나중에 현재 세션 userId로 바꿔줘야 함
        };

        // db에서 입력받은 parentId, postId를 이용해서 저장
        try {
            await fetch('/community/writeComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReply)
            });
        }catch (e) {
            alert("에러발생" + e);
        }

    };

    return (
        <div className="comment-section">
            <h3>댓글</h3>
            {/* 최상위 댓글 입력창 */}
            <div className="parent-comment-input-section">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                    onClick={handleAddComment}
                >
                    등록
                </button>
            </div>
            {/* 댓글/답글 목록 */}
            {comments.length === 0 && (
                <div style={{ color: "#aaa", padding: 24 }}>댓글이 없습니다.</div>
            )}
            {comments.map((comment) => (
                <Comment
                    key={comment.commentId}
                    comment={comment}
                    onReply={handleReply}
                    postAuthor={postAuthor}
                    postId={postId}
                    replyCount={comment.childCommentCount}
                />
            ))}
        </div>
    );
}

export default CommentSection;