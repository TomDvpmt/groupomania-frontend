import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    selectUserId,
    selectUserAdminStatus,
} from "../../../services/utils/selectors";

import UpdateMessageForm from "../../Forms/UpdateMessageForm";
import LikeButtons from "../../Buttons/LikeButtons";
import UpdateDeleteButtons from "../../Buttons/UpdateDeleteButtons";
import ErrorMessage from "../../ErrorMessage";

import { formatDate } from "../../../utils/utils";

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
    Collapse,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import PropTypes from "prop-types";

const Comment = ({ commentData, currentUserLikeValue, setHasNewComments }) => {
    Comment.propTypes = {
        commentData: PropTypes.object,
        currentUserLikeValue: PropTypes.number,
        setHasNewComments: PropTypes.func,
    };

    const isAdmin = useSelector(selectUserAdminStatus());
    const loggedUserId = useSelector(selectUserId());

    const canModify = isAdmin || commentData.authorId === loggedUserId;

    const commentId = commentData.id;
    const parentId = commentData.parentId;
    const formatedDate = formatDate(commentData.date);
    const authorName = `${commentData.authorFirstName} ${commentData.authorLastName}`;
    const [commentContent, setCommentContent] = useState(commentData.content);

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
                        component: "h5",
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
                        sx={{
                            objectFit: "scale-down",
                        }}
                    />
                )}
                {canModify && (
                    <LikeButtons
                        postId={commentId}
                        likes={commentData.likes}
                        dislikes={commentData.dislikes}
                        currentUserLikeValue={currentUserLikeValue}
                    />
                )}
                <CardActions>
                    {!canModify && (
                        <LikeButtons
                            postId={commentId}
                            likes={commentData.likes}
                            dislikes={commentData.dislikes}
                            currentUserLikeValue={currentUserLikeValue}
                        />
                    )}
                    {canModify && (
                        <UpdateDeleteButtons
                            messageId={commentId}
                            imgUrl={imgUrl}
                            setHasNewMessages={setHasNewComments}
                            setShowMessageUpdateForm={setShowCommentUpdateForm}
                            setErrorMessage={setErrorMessage}
                            setShowUpdateForm={setShowCommentUpdateForm}
                        />
                    )}
                </CardActions>
                <Collapse in={showCommentUpdateForm}>
                    <UpdateMessageForm
                        postId={commentId}
                        parentId={parentId}
                        prevContent={commentContent}
                        setMessageContent={setCommentContent}
                        imgUrl={imgUrl}
                        setShowUpdateForm={setShowCommentUpdateForm}
                        setHasNewMessages={setHasNewComments}
                    />
                </Collapse>
                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            </>
        </Card>
    );
};

export default Comment;
