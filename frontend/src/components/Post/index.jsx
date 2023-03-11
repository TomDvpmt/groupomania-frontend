import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils";
import LikeButtons from "../LikeButtons";

const Post = ({
    id,
    postUserId,
    email,
    content,
    imgUrl,
    date,
    // likes,
    // dislikes,
    currentUserLikeValue,
    admin,
    loggedUserId,
    setHasNewPosts,
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const formatedDate = formatDate(date);

    const handleUpdate = () => {
        navigate(`/update/${id}`);
    };

    const handleDelete = () => {
        if (
            !window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")
        ) {
            return;
        } else {
            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `BEARER ${token}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ imgUrl: imgUrl }),
            })
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) => setErrorMessage(message));
                    } else {
                        setHasNewPosts((hasNewPosts) => hasNewPosts + 1);
                    }
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <article className="post">
            <h3 className="post__user-address">
                {email} | {formatedDate}
            </h3>
            <div className="post__content">
                {imgUrl && <img src={imgUrl} alt="post illustration" />}
                <p>{content}</p>
            </div>
            <div className="post_like-buttons">
                <LikeButtons
                    postId={id}
                    // likes={likes}
                    // dislikes={dislikes}
                    currentUserLikeValue={currentUserLikeValue}
                />
            </div>
            <div className="post__buttons">
                {(admin || postUserId === loggedUserId) && (
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

export default Post;
