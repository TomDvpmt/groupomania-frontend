import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Comment from "../Comment";
import CreateMessageForm from "../CreateMessageForm";

import "./Comments.css";

const Comments = ({ token, parentId, showCommentForm, setShowCommentForm }) => {
    const [comments, setComments] = useState([]);
    const [hasNewComments, setHasNewComments] = useState(0);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        console.log("useEffect de Comments => getAllPosts");
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
                                authorId: result.authorId,
                                email: result.email,
                                imgUrl: result.imgUrl,
                                content: result.content,
                                date: result.date,
                                modified: result.modified,
                                likes:
                                    result.likesCount === null
                                        ? 0
                                        : result.likesCount,
                                dislikes:
                                    result.dislikesCount === null
                                        ? 0
                                        : result.dislikesCount,
                            }}
                            userData={{
                                token: token,
                                admin: data.admin,
                                loggedUserId: data.loggedUserId,
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
            });
    }, [parentId, hasNewComments, token, navigate]);

    useEffect(() => {
        setShowCommentForm(false);
    }, [hasNewComments, setShowCommentForm]);

    return (
        <>
            {showCommentForm && (
                <CreateMessageForm
                    token={token}
                    parentId={parentId}
                    setHasNewMessages={setHasNewComments}
                    setMessages={setComments}
                />
            )}
            {comments.length > 0 && (
                <>
                    <h2>
                        {commentsNumber} commentaire
                        {commentsNumber > 1 ? "s" : ""} :{" "}
                    </h2>
                    {comments}
                </>
            )}
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </>
    );
};

export default Comments;
