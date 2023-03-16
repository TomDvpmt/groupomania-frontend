import React, { useState } from "react";
import { formatDate } from "../../../utils/utils";
import UpdateForm from "../../UpdateForm";
import LikeButtons from "../../Buttons/LikeButtons";
import UpdateDeleteButtons from "../../Buttons/UpdateDeleteButtons";
import ErrorMessage from "../../ErrorMessage";
import {
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
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
                    title={commentData.email}
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
                    // action={
                    //     <LikeButtons
                    //         token={token}
                    //         postId={commentId}
                    //         likes={commentData.likes}
                    //         dislikes={commentData.dislikes}
                    //         currentUserLikeValue={userData.currentUserLikeValue}
                    //     />
                    // }
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
                        />
                    )}
                </CardActions>

                {showCommentUpdateForm && (
                    <UpdateForm
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
