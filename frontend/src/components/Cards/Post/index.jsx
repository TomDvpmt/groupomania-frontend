import React, { useState } from "react";
import Comments from "../../Comments";
import UpdateForm from "../../UpdateForm";
import LikeButtons from "../../Buttons/LikeButtons";
import ErrorMessage from "../../ErrorMessage";
import { formatDate, deletePost } from "../../../utils/utils";
import {
    Box,
    Stack,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const Post = ({ postData, userData, setHasNewPosts }) => {
    Post.propTypes = {
        postData: PropTypes.object,
        userData: PropTypes.object,
        setHasNewPosts: PropTypes.func,
    };

    const token = userData.token;
    const postId = postData.id;

    const [postContent, setPostContent] = useState(postData.content);
    const formatedDate = formatDate(postData.date);

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
        <Card component="article" sx={{ mb: 3 }}>
            <CardHeader
                component="header"
                title={postData.email}
                titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
                subheader={`${formatedDate}${
                    postData.modified === 1 ? " (modifié)" : ""
                }`}
                action={
                    <LikeButtons
                        token={token}
                        postId={postId}
                        likes={postData.likes}
                        dislikes={postData.dislikes}
                        currentUserLikeValue={userData.currentUserLikeValue}
                    />
                }
            />
            <CardContent>
                <Typography paragraph>{postContent}</Typography>
            </CardContent>
            {postData.imgUrl && (
                <CardMedia image={postData.imgUrl} component="img" />
            )}
            <CardActions>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    flexGrow="1"
                >
                    <Box>
                        {(userData.admin ||
                            postData.postAuthorId ===
                                userData.loggedUserId) && (
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    onClick={handleUpdate}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleDelete}
                                >
                                    Supprimer
                                </Button>
                            </Stack>
                        )}
                    </Box>
                    <Button variant="contained" onClick={handleReply}>
                        Répondre
                    </Button>
                </Box>
            </CardActions>
            {showPostUpdateForm && (
                <UpdateForm
                    token={token}
                    postId={postId}
                    parentId={0}
                    prevContent={postContent}
                    setMessageContent={setPostContent}
                    imgUrl={postData.imgUrl}
                    setShowUpdateForm={setShowPostUpdateForm}
                    setHasNewMessages={setHasNewPosts}
                />
            )}
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            <Comments
                token={token}
                parentId={postId}
                showCommentForm={showCommentForm}
                setShowCommentForm={setShowCommentForm}
            />
        </Card>
    );
};

export default Post;
