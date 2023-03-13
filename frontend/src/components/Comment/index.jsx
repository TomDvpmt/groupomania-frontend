import React, { useEffect, useState } from "react";
import {
    formatDate,
    deletePost,
    setLike,
    setPostLikes,
    setUserLikeStatus,
} from "../../utils/utils";
import UpdateForm from "../UpdateForm";
import LikeButtons from "../LikeButtons";

const Comment = ({ commentData, userData, setHasNewComments }) => {
    const commentId = commentData.id;
    const formatedDate = formatDate(commentData.date);
    const [commentContent, setCommentContent] = useState(commentData.content);
    const [commentLikesCount, setCommentLikesCount] = useState(
        commentData.likes
    );
    const [commentDislikesCount, setCommentDislikesCount] = useState(
        commentData.dislikes
    );

    const token = userData.token;
    const [commentLikeStatus, setCommentLikeStatus] = useState(
        userData.currentUserLikeValue
    );

    const [showCommentUpdateForm, setShowCommentUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLike = (e) => {
        // setLike(
        //     e,
        //     token,
        //     commentId,
        //     setPostLikes,
        //     setCommentLikesCount,
        //     setCommentDislikesCount,
        //     setUserLikeStatus,
        //     setCommentLikeStatus,
        //     setErrorMessage
        // );
    };

    const handleUpdate = () => {
        setShowCommentUpdateForm(
            (showCommentUpdateForm) => !showCommentUpdateForm
        );
    };

    const handleDelete = () => {
        deletePost(
            token,
            commentId,
            commentData.imgUrl,
            setHasNewComments,
            setErrorMessage
        );
    };

    useEffect(() => {
        // setPostLikes(
        //     token,
        //     commentId,
        //     setCommentLikesCount,
        //     setCommentDislikesCount,
        //     setErrorMessage
        // );
        // setUserLikeStatus(token, commentId, setCommentLikeStatus);
    }, [commentId, token]);

    return (
        <article className="comment">
            <header className="comment__header">
                <h3 className="comment__user-infos">
                    {commentData.email} | {formatedDate}
                    {commentData.modified && "(modifié)"}
                </h3>
            </header>
            <div className="comment__content">
                {commentData.imgUrl && (
                    <img src={commentData.imgUrl} alt="comment illustration" />
                )}
                <p>{commentContent}</p>
            </div>
            <div className="comment_like-buttons">
                {/* <button onClick={handleLike} data-likevalue={1}>
                    Like ({commentLikesCount}) {commentLikeStatus === 1 && "👍"}
                </button>
                <button onClick={handleLike} data-likevalue={-1}>
                    Dislike ({commentDislikesCount}){" "}
                    {commentLikeStatus === -1 && "👎"}
                </button> */}
                <LikeButtons
                    token={token}
                    postId={commentId}
                    likes={commentData.likes}
                    dislikes={commentData.dislikes}
                    currentUserLikeValue={userData.currentUserLikeValue}
                />
            </div>
            <div className="comment__buttons">
                {(userData.admin ||
                    commentData.authorId === userData.loggedUserId) && (
                    <React.Fragment>
                        <button onClick={handleUpdate}>Modifier</button>
                        <button onClick={handleDelete}>Supprimer</button>
                    </React.Fragment>
                )}
            </div>
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
            {showCommentUpdateForm && (
                <UpdateForm
                    token={token}
                    postId={commentId}
                    content={commentContent}
                    setContent={setCommentContent}
                    imgUrl={commentData.imgUrl}
                    setShowUpdateForm={setShowCommentUpdateForm}
                    setHasNewMessages={setHasNewComments}
                />
            )}
        </article>
    );
};

export default Comment;
