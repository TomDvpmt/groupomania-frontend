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
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/${postId}`, {
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
                    return data.results.map((result) => (
                        <Comment
                            key={result.id}
                            id={result.id}
                            commentUserId={result.commentUserId}
                            email={result.email}
                            imgUrl={result.imgUrl}
                            content={result.content}
                            date={result.date}
                            likes={
                                result.likesCount === null
                                    ? 0
                                    : result.likesCount
                            }
                            dislikes={
                                result.dislikesCount === null
                                    ? 0
                                    : result.dislikesCount
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
