import React, { useState } from "react";
import { formatDate, deletePost } from "../../../utils/utils";
import UpdateForm from "../../UpdateForm";
import LikeButtons from "../../Buttons/LikeButtons";
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from "@mui/material";

const Comment = ({ commentData, userData, setHasNewComments }) => {
    const commentId = commentData.id;
    const formatedDate = formatDate(commentData.date);
    const [commentContent, setCommentContent] = useState(commentData.content);

    const token = userData.token;

    const [showCommentUpdateForm, setShowCommentUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    return (
        <Card component="article">
            <header>
                <h3>
                    {commentData.email} | {formatedDate}
                    {commentData.modified && "(modifié)"}
                </h3>
            </header>
            <div>
                {commentData.imgUrl && (
                    <img src={commentData.imgUrl} alt="comment illustration" />
                )}
                <p>{commentContent}</p>
            </div>
            <div>
                <LikeButtons
                    token={token}
                    postId={commentId}
                    likes={commentData.likes}
                    dislikes={commentData.dislikes}
                    currentUserLikeValue={userData.currentUserLikeValue}
                />
            </div>
            <div>
                {(userData.admin ||
                    commentData.authorId === userData.loggedUserId) && (
                    <React.Fragment>
                        <button onClick={handleUpdate}>Modifier</button>
                        <button onClick={handleDelete}>Supprimer</button>
                    </React.Fragment>
                )}
            </div>
            {errorMessage && <p>{errorMessage}</p>}
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
        </Card>
    );
};

export default Comment;
