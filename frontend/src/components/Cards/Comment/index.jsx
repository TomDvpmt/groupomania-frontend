import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatDate } from "../../../utils/utils";
import UpdateMessageForm from "../../Forms/UpdateMessageForm";
import LikeButtons from "../../Buttons/LikeButtons";
import UpdateDeleteButtons from "../../Buttons/UpdateDeleteButtons";
import ErrorMessage from "../../ErrorMessage";
import {
    Box,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Link,
    Typography,
    IconButton,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";
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
    const authorName = `${commentData.authorFirstName} ${commentData.authorLastName}`;
    const [commentContent, setCommentContent] = useState(commentData.content);

    const canModify =
        userData.admin || commentData.authorId === userData.loggedUserId;
    const token = userData.token;
    const imgUrl = commentData.imgUrl;

    const [showCommentUpdateForm, setShowCommentUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <Card
            component="article"
            sx={{
                backgroundColor: "#F5F5F5",
            }}
        >
            <>
                <CardHeader
                    component="header"
                    title={
                        commentData.authorIsAdmin ? (
                            <Typography color="primary" fontWeight="700">
                                ADMIN
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                {authorName !== " " ? (
                                    <Link
                                        component={RouterLink}
                                        to={`/users/${commentData.authorId}`}
                                        underline="none"
                                    >
                                        {authorName}
                                    </Link>
                                ) : (
                                    <Typography>(anonyme)</Typography>
                                )}
                                <IconButton
                                    color="primary"
                                    sx={{ padding: 0 }}
                                    href={`mailto:${commentData.authorEmail}`}
                                >
                                    <MailOutline fontSize="small" />
                                </IconButton>
                            </Box>
                        )
                    }
                    titleTypographyProps={{
                        fontSize: "1rem",
                        component: "h4",
                        variant: "h6",
                        fontWeight: "bold",
                    }}
                    subheader={`${formatedDate}${
                        commentData.modified === 1 ? " (modifié)" : ""
                    }`}
                    subheaderTypographyProps={{
                        fontSize: ".8rem",
                    }}
                />
                <CardContent>
                    <Typography paragraph fontSize=".9rem">
                        {commentContent}
                    </Typography>
                </CardContent>
                {imgUrl && (
                    <CardMedia
                        image={imgUrl}
                        component="img"
                        alt="Illustration du commentaire"
                    />
                )}
                {canModify && (
                    <LikeButtons
                        token={token}
                        postId={commentId}
                        likes={commentData.likes}
                        dislikes={commentData.dislikes}
                        currentUserLikeValue={userData.currentUserLikeValue}
                    />
                )}
                <CardActions>
                    {!canModify && (
                        <LikeButtons
                            token={token}
                            postId={commentId}
                            likes={commentData.likes}
                            dislikes={commentData.dislikes}
                            currentUserLikeValue={userData.currentUserLikeValue}
                        />
                    )}
                    {canModify && (
                        <UpdateDeleteButtons
                            token={token}
                            messageId={commentId}
                            imgUrl={imgUrl}
                            setHasNewMessages={setHasNewComments}
                            setShowMessageUpdateForm={setShowCommentUpdateForm}
                            setErrorMessage={setErrorMessage}
                            setShowUpdateForm={setShowCommentUpdateForm}
                        />
                    )}
                </CardActions>

                {showCommentUpdateForm && (
                    <UpdateMessageForm
                        token={token}
                        postId={commentId}
                        parentId={parentId}
                        prevContent={commentContent}
                        setMessageContent={setCommentContent}
                        imgUrl={imgUrl}
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
