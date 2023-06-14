import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Comment from "../Comment";
import CreateMessageForm from "../Forms/CreateMessageForm";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";

import { postSetCommentsFromDB } from "../../services/features/posts";

import { Box, Typography, Stack, Collapse } from "@mui/material";
import PropTypes from "prop-types";

const Comments = ({ parentId, showCommentForm, setShowCommentForm }) => {
    Comments.propTypes = {
        parentId: PropTypes.number,
        showCommentForm: PropTypes.bool,
        setShowCommentForm: PropTypes.func,
    };

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [hasNewComments, setHasNewComments] = useState(0);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/API/comments/all/${parentId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.results.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    setCommentsNumber(data.results.length);
                    dispatch(
                        postSetCommentsFromDB({
                            postId: parentId,
                            comments: data.results,
                        })
                    );
                    return data.results.map((result) => (
                        <Comment
                            key={result.id}
                            commentData={{
                                id: result.id,
                                parentId: parentId,
                                authorId: result.authorId,
                                authorFirstName: result.firstName,
                                authorLastName: result.lastName,
                                authorIsAdmin: result.admin,
                                authorEmail: result.email,
                                imgUrl: result.imgUrl,
                                content: result.content,
                                date: result.date,
                                modified: result.modified,
                                likes: result.likes === null ? 0 : result.likes,
                                dislikes:
                                    result.dislikes === null
                                        ? 0
                                        : result.dislikes,
                            }}
                            currentUserLikeValue={result.currentUserLikeValue}
                            setHasNewComments={setHasNewComments}
                        />
                    ));
                }
            })
            .then((commentsList) => setComments(commentsList))
            .catch((error) => {
                console.error(
                    "Impossible d'afficher les commentaires :",
                    error
                );
                setErrorMessage("Impossible d'afficher les commentaires.");
            })
            .finally(setLoading(false));
    }, [parentId, hasNewComments, token, navigate, dispatch]);

    useEffect(() => {
        setShowCommentForm(false);
    }, [hasNewComments, setShowCommentForm]);

    return (
        <>
            <Collapse in={showCommentForm}>
                <CreateMessageForm
                    isReply={true}
                    parentId={parentId}
                    setHasNewMessages={setHasNewComments}
                    setShowNewMessageForm={setShowCommentForm}
                />
            </Collapse>
            {comments.length > 0 && (
                <Box
                    sx={{
                        padding: {
                            xs: ".5rem",
                            sm: ".5rem .5rem .5rem 3rem",
                        },
                    }}
                >
                    <Typography component="h3" variant="h5" mt={3} mb={2}>
                        {commentsNumber} commentaire
                        {commentsNumber > 1 ? "s" : ""} :{" "}
                    </Typography>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Stack spacing={2}>{comments}</Stack>
                    )}
                </Box>
            )}
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </>
    );
};

export default Comments;
