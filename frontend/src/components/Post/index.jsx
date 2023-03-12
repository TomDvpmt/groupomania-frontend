import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Comments from "../Comments";
import {
    formatDate,
    setUserLikeStatus,
    deletePost,
    setPostLikes,
    setLike,
} from "../../utils/utils";
import "./Post.css";

const Post = ({
    id,
    postUserId,
    email,
    content,
    imgUrl,
    date,
    likes,
    dislikes,
    admin,
    loggedUserId,
    setHasNewPosts,
}) => {
    const [likesCount, setLikesCount] = useState(likes);
    const [dislikesCount, setDislikesCount] = useState(dislikes);
    const [likeStatus, setLikeStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const formatedDate = formatDate(date);

    const handleUpdate = () => {
        navigate(`/update/${id}`);
    };

    const handleDelete = () => {
        deletePost(token, id, imgUrl, setHasNewPosts, setErrorMessage);
    };

    const handleLike = (e) => {
        setLike(
            e,
            token,
            id,
            setPostLikes,
            setLikesCount,
            setDislikesCount,
            setUserLikeStatus,
            setLikeStatus,
            setErrorMessage
        );
    };

    useEffect(() => {
        setPostLikes(
            token,
            id,
            setLikesCount,
            setDislikesCount,
            setErrorMessage
        );
        setUserLikeStatus(token, id, setLikeStatus);
    }, [id, token]);

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
                <button onClick={handleLike} data-likevalue={1}>
                    Like ({likesCount}) {likeStatus === 1 && "👍"}
                </button>
                <button onClick={handleLike} data-likevalue={-1}>
                    Dislike ({dislikesCount}) {likeStatus === -1 && "👎"}
                </button>
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
            <h2>Commentaires : </h2>
            <Comments postId={id} />
        </article>
    );
};

export default Post;
