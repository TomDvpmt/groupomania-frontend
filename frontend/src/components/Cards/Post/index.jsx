import React, { useState } from "react";
import Comments from "../../Comments";
import UpdateForm from "../../UpdateForm";
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
    const canModify =
        userData.admin || postData.postAuthorId === userData.loggedUserId;
    const postId = postData.id;
    const formatedDate = formatDate(postData.date);
    const [postContent, setPostContent] = useState(postData.content);

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showPostUpdateForm, setShowPostUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleReply = () => {
        setShowCommentForm((showCommentForm) => !showCommentForm);
    };

    return (
        <Card component="article" sx={{ mb: 3 }}>
            <CardHeader
                component="header"
                title={postData.email}
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
                // action={
                //     <LikeButtons
                //         token={token}
                //         postId={postId}
                //         likes={postData.likes}
                //         dislikes={postData.dislikes}
                //         currentUserLikeValue={userData.currentUserLikeValue}
                //     />
                // }
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
                />
            )}
            {canModify && (
                <LikeButtons
                    token={token}
                    postId={postId}
                    likes={postData.likes}
                    dislikes={postData.dislikes}
                    currentUserLikeValue={userData.currentUserLikeValue}
                />
            )}
            <CardActions>
                <Box
                    flexGrow="1"
                    display="flex"
                    justifyContent={canModify ? "center" : "space-between"}
                    alignItems="center"
                    gap={1}
                >
                    {canModify && (
                        <UpdateDeleteButtons
                            token={token}
                            messageId={postId}
                            imgUrl={postData.imgUrl}
                            setHasNewMessages={setHasNewPosts}
                            setErrorMessage={setErrorMessage}
                            setShowMessageUpdateForm={setShowPostUpdateForm}
                        />
                    )}
                    {!canModify && (
                        <LikeButtons
                            token={token}
                            postId={postId}
                            likes={postData.likes}
                            dislikes={postData.dislikes}
                            currentUserLikeValue={userData.currentUserLikeValue}
                        />
                    )}
                    <Button
                        variant="contained"
                        onClick={handleReply}
                        size="small"
                    >
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
