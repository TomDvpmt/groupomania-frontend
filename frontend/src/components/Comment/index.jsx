import React, { useState } from "react";
import { formatDate } from "../../utils";

const Comment = ({
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

    const handleUpdate = () => {};

    const handleDelete = () => {
        if (
            !window.confirm(
                "Êtes-vous sûr de vouloir supprimer ce commentaire ?"
            )
        ) {
            return;
        } else {
            // fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${id}`, {
            //     method: "DELETE",
            //     headers: {
            //         Authorization: `BEARER ${token}`,
            //         "Content-type": "application/json",
            //     },
            //     body: JSON.stringify({ imgUrl: imgUrl }),
            // })
            //     .then((response) => {
            //         if (response.status >= 400) {
            //             response
            //                 .json()
            //                 .then(({ message }) => setErrorMessage(message));
            //         } else {
            //             setHasNewPosts((hasNewPosts) => hasNewPosts + 1);
            //         }
            //     })
            //     .catch(() =>
            //         setErrorMessage("Impossible de supprimer le message.")
            //     );
        }
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
