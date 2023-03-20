import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comment from "../Cards/Comment";
import CreateMessageForm from "../Forms/CreateMessageForm";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";
import { Box, Typography, Stack, Collapse } from "@mui/material";
import PropTypes from "prop-types";

const Comments = ({ token, parentId, showCommentForm, setShowCommentForm }) => {
    Comments.propTypes = {
        token: PropTypes.string,
        parentId: PropTypes.number,
        showCommentForm: PropTypes.bool,
        setShowCommentForm: PropTypes.func,
    };

    const [comments, setComments] = useState([]);
    const [hasNewComments, setHasNewComments] = useState(0);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(
            `${process.env.REACT_APP_BACKEND_URI}/API/posts/all/${parentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `BEARER ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    setCommentsNumber(data.results.length);
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
                            userData={{
                                token: token,
                                admin: data.admin,
                                loggedUserId: data.loggedUserId,
                                currentUserLikeValue:
                                    result.currentUserLikeValue,
                            }}
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
    }, [parentId, hasNewComments, token, navigate]);

    useEffect(() => {
        setShowCommentForm(false);
    }, [hasNewComments, setShowCommentForm]);

    return (
        <>
            <Collapse in={showCommentForm}>
                <CreateMessageForm
                    isReply={true}
                    token={token}
                    parentId={parentId}
                    setHasNewMessages={setHasNewComments}
                    setMessages={setComments}
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
                    <Typography component="h4" variant="h5" mt={3} mb={2}>
                        {commentsNumber} commentaire
                        {commentsNumber > 1 ? "s" : ""} :{" "}
                    </Typography>
                    <Stack spacing={2}>{comments}</Stack>
                </Box>
            )}
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </>
    );
};

export default Comments;
