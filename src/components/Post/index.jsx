import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

import Comments from "../Comments";
import UpdateMessageForm from "../Forms/UpdateMessageForm";
import LikeButtons from "../Buttons/LikeButtons";
import UpdateDeleteButtons from "../Buttons/UpdateDeleteButtons";
import AlertDialog from "../AlertDialog";
import ErrorMessage from "../ErrorMessage";

import {
    selectUserId,
    selectUserAdminStatus,
} from "../../services/utils/selectors";

import { formatDate } from "../../utils/utils";

import {
    Box,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    IconButton,
    Link,
    Collapse,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";

import { theme } from "../../assets/styles/theme";

import PropTypes from "prop-types";

const Post = ({
    postIndex,
    postData,
    currentUserLikeValue,
    setHasNewPosts,
}) => {
    Post.propTypes = {
        postIndex: PropTypes.number,
        postData: PropTypes.object,
        currentUserLikeValue: PropTypes.number,
        setHasNewPosts: PropTypes.func,
    };

    const isAdmin = useSelector(selectUserAdminStatus());
    const loggedUserId = useSelector(selectUserId());
    const postId = postData.id;

    const canModify = isAdmin || postData.authorId === loggedUserId;

    const authorName = `${postData.authorFirstName} ${postData.authorLastName}`;
    const formatedDate = formatDate(postData.date);
    const [postContent, setPostContent] = useState(postData.content);

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showPostUpdateForm, setShowPostUpdateForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleReply = () => {
        setShowCommentForm((showCommentForm) => !showCommentForm);
    };

    return (
        <Card component="article" sx={{ mb: 3, padding: { sm: 2 } }}>
            <CardHeader
                component="header"
                title={
                    postData.authorIsAdmin ? (
                        <Typography
                            width="min-content"
                            padding="0 .3rem"
                            bgcolor={theme.palette.primary.light}
                            color="primary"
                            fontWeight="700"
                        >
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
                                    to={`/users/${postData.authorId}`}
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
                                href={`mailto:${postData.authorEmail}`}
                            >
                                <MailOutline fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                }
                titleTypographyProps={{
                    component: "h2",
                    variant: "h6",
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
                subheader={`${formatedDate}${
                    postData.modified === 1 ? " (modifié)" : ""
                }`}
                subheaderTypographyProps={{
                    fontSize: ".8rem",
                }}
                sx={{
                    padding: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            />
            <CardContent>
                <Typography paragraph>{postContent}</Typography>
            </CardContent>
            {postData.imgUrl && (
                <CardMedia
                    image={postData.imgUrl}
                    component="img"
                    alt="Illustration du message"
                    sx={{
                        objectFit: "scale-down",
                    }}
                />
            )}
            {canModify && (
                <LikeButtons
                    messageType="post"
                    messageId={postId}
                    likes={postData.likes}
                    dislikes={postData.dislikes}
                    currentUserLikeValue={currentUserLikeValue}
                />
            )}
            <CardActions>
                <Box
                    flexGrow="1"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                >
                    {canModify && (
                        <>
                            <UpdateDeleteButtons
                                setShowAlert={setShowAlert}
                                setShowMessageUpdateForm={setShowPostUpdateForm}
                            />
                            {showAlert && (
                                <AlertDialog
                                    issue="post"
                                    issueId={postId}
                                    parentId={0}
                                    imgUrl={postData.imgUrl}
                                    setHasNewMessages={setHasNewPosts}
                                    setErrorMessage={setErrorMessage}
                                    showAlert={showAlert}
                                    setShowAlert={setShowAlert}
                                />
                            )}
                        </>
                    )}
                    {!canModify && (
                        <LikeButtons
                            messageType="post"
                            messageId={postId}
                            likes={postData.likes}
                            dislikes={postData.dislikes}
                            currentUserLikeValue={currentUserLikeValue}
                        />
                    )}
                    <Button
                        variant="contained"
                        onClick={handleReply}
                        size="small"
                        sx={{ fontWeight: "700" }}
                    >
                        Répondre
                    </Button>
                </Box>
            </CardActions>
            <Collapse in={showPostUpdateForm}>
                <UpdateMessageForm
                    messageId={postId}
                    parentId={0}
                    prevContent={postContent}
                    setMessageContent={setPostContent}
                    imgUrl={postData.imgUrl}
                    setShowUpdateForm={setShowPostUpdateForm}
                    setHasNewMessages={setHasNewPosts}
                />
            </Collapse>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            <Comments
                parentId={postId}
                showCommentForm={showCommentForm}
                setShowCommentForm={setShowCommentForm}
            />
        </Card>
    );
};

export default Post;
