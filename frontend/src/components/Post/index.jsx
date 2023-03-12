import React, { useEffect, useState } from "react";
import Comments from "../Comments";
import UpdateForm from "../UpdateForm";
import {
    formatDate,
    setUserLikeStatus,
    deletePost,
    setPostLikes,
    setLike,
} from "../../utils/utils";
import "./Post.css";

const Post = ({ postData, userData, setHasNewPosts }) => {
    const [likesCount, setLikesCount] = useState(postData.likes);
    const [dislikesCount, setDislikesCount] = useState(postData.dislikes);
    const [likeStatus, setLikeStatus] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showPostUpdateForm, setShowPostUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [postContent, setPostContent] = useState(postData.content);

    const token = userData.token;
    const postId = postData.id;
    const formatedDate = formatDate(postData.date);

    const handleUpdate = () => {
        setShowPostUpdateForm((showPostUpdateForm) => !showPostUpdateForm);
    };

    const handleDelete = () => {
        deletePost(
            token,
            postId,
            postData.imgUrl,
            setHasNewPosts,
            setErrorMessage
        );
    };

    const handleLike = (e) => {
        setLike(
            e,
            token,
            postId,
            setPostLikes,
            setLikesCount,
            setDislikesCount,
            setUserLikeStatus,
            setLikeStatus,
            setErrorMessage
        );
    };

    const handleReply = () => {
        setShowCommentForm((showCommentForm) => !showCommentForm);
    };

    useEffect(() => {
        setPostLikes(
            token,
            postId,
            setLikesCount,
            setDislikesCount,
            setErrorMessage
        );
        setUserLikeStatus(token, postId, setLikeStatus);
    }, [postId, token]);

    return (
        <article className="post">
            <h3 className="post__user-infos">
                {postData.email} | {formatedDate} (
                {postData.modified && "modifié"})
            </h3>
            <div className="post__content">
                {postData.imgUrl && (
                    <img src={postData.imgUrl} alt="post illustration" />
                )}
                <p>{postContent}</p>
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
                {(userData.admin ||
                    postData.postUserId === userData.loggedUserId) && (
                    <>
                        <button onClick={handleUpdate}>Modifier</button>
                        <button onClick={handleDelete}>Supprimer</button>
                    </>
                )}
            </div>
            <button onClick={handleReply}>Répondre</button>
            {showPostUpdateForm && (
                <UpdateForm
                    token={token}
                    postId={postId}
                    content={postContent}
                    setContent={setPostContent}
                    imgUrl={postData.imgUrl}
                    setShowUpdateForm={setShowPostUpdateForm}
                />
            )}
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
            <Comments
                token={token}
                postId={postId}
                showCommentForm={showCommentForm}
                setShowCommentForm={setShowCommentForm}
            />
        </article>
    );
};

export default Post;
