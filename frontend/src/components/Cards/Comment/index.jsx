import React, { useState } from "react";
import { formatDate, deletePost } from "../../../utils/utils";
import UpdateForm from "../../UpdateForm";
import LikeButtons from "../../Buttons/LikeButtons";
import ErrorMessage from "../../ErrorMessage";
import {
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const Comment = ({ commentData, userData, setHasNewComments }) => {
    Comment.propTypes = {
        commentData: PropTypes.object,
        userData: PropTypes.object,
        setHasNewComments: PropTypes.func,
    };

    const commentId = commentData.id;
    const parentId = commentData.parentId;
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
        <Card
            sx={{
                backgroundColor: "#F5F5F5",
            }}
        >
            <>
                <CardHeader
                    component="header"
                    title={commentData.email}
                    titleTypographyProps={{
                        fontSize: "1rem",
                        variant: "h6",
                        fontWeight: "bold",
                    }}
                    subheader={`${formatedDate}${
                        commentData.modified === 1 ? " (modifié)" : ""
                    }`}
                    subheaderTypographyProps={{
                        fontSize: ".8rem",
                    }}
                    action={
                        <LikeButtons
                            token={token}
                            postId={commentId}
                            likes={commentData.likes}
                            dislikes={commentData.dislikes}
                            currentUserLikeValue={userData.currentUserLikeValue}
                        />
                    }
                />
                <CardContent>
                    <Typography paragraph fontSize=".9rem">
                        {commentContent}
                    </Typography>
                </CardContent>
                {commentData.imgUrl && (
                    <CardMedia component="img" image={commentData.imgUrl} />
                )}
                {userData.admin === true ||
                commentData.authorId === userData.loggedUserId ? (
                    <CardActions>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" onClick={handleUpdate}>
                                Modifier
                            </Button>
                            <Button variant="outlined" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </Stack>
                    </CardActions>
                ) : null}
                {showCommentUpdateForm && (
                    <UpdateForm
                        token={token}
                        postId={commentId}
                        parentId={parentId}
                        prevContent={commentContent}
                        setMessageContent={setCommentContent}
                        imgUrl={commentData.imgUrl}
                        setShowUpdateForm={setShowCommentUpdateForm}
                        setHasNewMessages={setHasNewComments}
                    />
                )}
                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            </>
        </Card>
    );
};

export default Comment;
