import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    formatDate,
    deletePost,
    setLike,
    setPostLikes,
    setUserLikeStatus,
} from "../../utils/utils";

const Comment = ({
    id,
    admin,
    commentId,
    commentUserId,
    email,
    imgUrl,
    content,
    date,
    likes,
    dislikes,
    loggedUserId,
    setHasNewComments,
}) => {
    const [commentLikesCount, setCommentLikesCount] = useState(likes);
    const [commentDislikesCount, setCommentDislikesCount] = useState(dislikes);
    const [commentLikeStatus, setCommentLikeStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const formatedDate = formatDate(date);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLike = (e) => {
        setLike(
            e,
            token,
            id,
            setPostLikes,
            setCommentLikesCount,
            setCommentDislikesCount,
            setUserLikeStatus,
            setCommentLikeStatus,
            setErrorMessage
        );
    };

    const handleUpdate = () => {
        navigate(`/update/${id}`);
    };

    const handleDelete = () => {
        deletePost(token, id, imgUrl, setHasNewComments, setErrorMessage);
    };

    useEffect(() => {
        setPostLikes(
            token,
            id,
            setCommentLikesCount,
            setCommentDislikesCount,
            setErrorMessage
        );
        setUserLikeStatus(token, id, setCommentLikeStatus);
    }, [id, token]);

    return (
        <article className="comment">
            <h3 className="comment__user-address">
                {email} | {formatedDate}
            </h3>
            <div className="comment__content">
                {imgUrl && <img src={imgUrl} alt="comment illustration" />}
                <p>{content}</p>
            </div>
            <div className="comment_like-buttons">
                <button onClick={handleLike} data-likevalue={1}>
                    Like ({commentLikesCount}) {commentLikeStatus === 1 && "👍"}
                </button>
                <button onClick={handleLike} data-likevalue={-1}>
                    Dislike ({commentDislikesCount}){" "}
                    {commentLikeStatus === -1 && "👎"}
                </button>
            </div>
            <div className="comment__buttons">
                {(admin || commentUserId === loggedUserId) && (
                    <React.Fragment>
                        <button onClick={handleUpdate}>Modifier</button>
                        <button onClick={handleDelete}>Supprimer</button>
                    </React.Fragment>
                )}
            </div>
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
        </article>
    );
};

export default Comment;
