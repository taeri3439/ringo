import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

// 댓글/답글(무한 계층) 재귀 컴포넌트
function Comment({ comment, onReply, postAuthor, postId, replyCount }) {
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [childComments, setChildComments] = useState([]);
    const [localReplyCount, setLocalReplyCount] = useState(replyCount ?? 0);


    useEffect(() => {

    }, []);

    // 답글 등록
    const handleReply = async () => {
        if (!replyText.trim()) return;

        //대댓글 db에 저장
        await onReply(comment.commentId, replyText);
        await checkChildComments(comment.commentId);


        setReplyText("");
        setShowReplies(true);
        setLocalReplyCount(localReplyCount + 1);
    };

    // 자식 댓글 불러오기
    const checkChildComments = async (parentId) => {
        const response = await fetch(`/community/getChildComments?commentParentId=${parentId}&postId=${postId}`);
        setChildComments(await response.json());

    }


    // 답글(1단계)에만 depth-1 클래스 추가
    const commentBoxClass = comment.commentDepth === 1
        ? "comment-box depth-1"
        : "comment-box";

    return (
        <div style={{ marginTop: 14 }}>
            <div className={commentBoxClass}>
                <div className="comment-author">
                    {comment.userNickName}
                    {comment.userNickName === postAuthor && (
                        <span className="author-badge">작성자</span>
                    )}
                </div>
                <div className="comment-date">
                    {dayjs(comment.commentCreateTime).format('YYYY-MM-DD')}
                </div>
                <div className="comment-content">{comment.commentContent}</div>
                {/* 답글 버튼 & 답글 개수 */}
                {comment.commentDepth === 0 && (
                    <button
                        onClick={() => {
                            setShowReplies((v) => !v);
                            checkChildComments(comment.commentId);
                        }}
                        className="reply-btn"
                    >
                        {showReplies ? "답글 접기" : `답글 ${localReplyCount}`}
                    </button>
                )}
            </div>
            {/*답글 펼치기*/}
            {/*{showReplies && comment.children && (*/}
            {showReplies &&  childComments && (
                <div style={{ marginLeft: 0, marginTop: 10 }}>
                    {childComments.map(child => (
                        <Comment
                            key={child.commentId}
                            comment={child}
                            onReply={onReply}
                            postAuthor={postAuthor}
                            postId={postId}
                        />
                    ))}
                    {/* 답글 작성란 */}
                    <div className="reply-input-area">
                        <div className="textarea-container">
                            <textarea
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="답글을 입력하세요"
                                rows={3}
                            />
                            <button
                                onClick={() => {
                                    handleReply();
                                }}
                                className="textarea-submit-btn"
                            >
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Comment;