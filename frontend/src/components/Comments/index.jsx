import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comment from "../Comment";

import "./Comments.css";

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [hasNewComments, setHasNewComments] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/comments`,
            {
                method: "GET",
                headers: {
                    Authorization: `BEARER ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.comments.length === 0) {
                    return <p>Aucun commentaire à afficher.</p>;
                } else {
                    return data.comments.map((comment) => (
                        <Comment
                            key={comment.commentId}
                            commentId={comment.commentId}
                            commentUserId={comment.commentUserId}
                            email={comment.email}
                            imgUrl={comment.imgUrl}
                            content={comment.content}
                            date={comment.date}
                            likes={
                                comment.likesCount === null
                                    ? 0
                                    : comment.likesCount
                            }
                            dislikes={
                                comment.dislikesCount === null
                                    ? 0
                                    : comment.dislikesCount
                            }
                            admin={data.admin}
                            loggedUserId={data.loggedUserId}
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
            });
    }, [postId, hasNewComments, token, navigate]);

    return (
        <>
            {comments}
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </>
    );
};

export default Comments;
