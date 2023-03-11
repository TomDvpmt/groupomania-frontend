import React, { useState } from "react";
import { formatDate } from "../../utils";
import { deletePost } from "../../utils";

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
    const [errorMessage, setErrorMessage] = useState("");
    const formatedDate = formatDate(date);
    const token = localStorage.getItem("token");

    console.log(
        "admin :",
        admin,
        "commentUserId : ",
        commentUserId,
        "loggedUserId :",
        loggedUserId
    );

    const handleUpdate = () => {};

    const handleDelete = () => {
        deletePost(token, id, imgUrl, setHasNewComments, setErrorMessage);
    };

    return (
        <article className="comment">
            <h3 className="comment__user-address">
                {email} | {formatedDate}
            </h3>
            <div className="comment__content">
                {imgUrl && <img src={imgUrl} alt="post illustration" />}
                <p>{content}</p>
            </div>
            <div className="comment_like-buttons">
                {/* <button onClick={handleLike} data-likevalue={1}>
                    Like ({likesCount}) {likeStatus === 1 && "(USER)"}
                </button>
                <button onClick={handleLike} data-likevalue={-1}>
                    Dislike ({dislikesCount}) {likeStatus === -1 && "(USER)"}
                </button> */}
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
