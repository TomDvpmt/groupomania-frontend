import React, { useState } from "react";
import Comments from "../../Comments";
import UpdateForm from "../../UpdateForm";
import LikeButtons from "../../Buttons/LikeButtons";
import { formatDate, deletePost } from "../../../utils/utils";
import {
    Box,
    Container,
    Stack,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
} from "@mui/material";

const Post = ({ postData, userData, setHasNewPosts }) => {
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
                title={postData.email}
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
            <CardMedia>
                {postData.imgUrl && (
                    <img src={postData.imgUrl} alt="post illustration" />
                )}
            </CardMedia>
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
                {errorMessage && <p>{errorMessage}</p>}
            </CardActions>
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
