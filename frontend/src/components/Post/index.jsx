import React, { useState } from "react";
import Comments from "../Comments";
import UpdateForm from "../UpdateForm";
import LikeButtons from "../LikeButtons";
import { formatDate, deletePost } from "../../utils/utils";
import "./Post.css";

const Post = ({ postData, userData, setHasNewPosts }) => {
    const postId = postData.id;
    const [postContent, setPostContent] = useState(postData.content);
    const formatedDate = formatDate(postData.date);

    const token = userData.token;

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showPostUpdateForm, setShowPostUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const handleReply = () => {
        setShowCommentForm((showCommentForm) => !showCommentForm);
    };

    return (
        <article className="post">
            <h3 className="post__user-infos">
                {postData.email} | {formatedDate}
                {postData.modified === 1 && " (modifié)"}
            </h3>
            <div className="post__content">
                {postData.imgUrl && (
                    <img src={postData.imgUrl} alt="post illustration" />
                )}
                <p>{postContent}</p>
            </div>
            <div className="post_like-buttons">
                {
                    <LikeButtons
                        token={token}
                        postId={postId}
                        likes={postData.likes}
                        dislikes={postData.dislikes}
                        currentUserLikeValue={userData.currentUserLikeValue}
                    />
                }
            </div>
            <div className="post__buttons">
                {(userData.admin ||
                    postData.postAuthorId === userData.loggedUserId) && (
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
                    setHasNewMessages={setHasNewPosts}
                />
            )}
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
            <Comments
                token={token}
                parentId={postId}
                showCommentForm={showCommentForm}
                setShowCommentForm={setShowCommentForm}
            />
        </article>
    );
};

export default Post;
