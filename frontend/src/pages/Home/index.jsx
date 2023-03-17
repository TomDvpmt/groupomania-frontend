import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../../components/Cards/Post";
import CreateMessageForm from "../../components/Forms/CreateMessageForm";
import PostNewMessageButton from "../../components/Buttons/PostNewMessageButton";
import ErrorMessage from "../../components/ErrorMessage";
import { Box, Typography } from "@mui/material";
import { theme } from "../../utils/theme";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token || token === "null") navigate("/login");

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/0`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.setItem("token", null);
                    console.error("Non autorisé.");
                    navigate("/login");
                } else return response.json();
            })
            .then((data) => {
                if (data.results.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    return data.results.map((result) => (
                        <Post
                            key={result.id}
                            postData={{
                                id: result.id,
                                parentId: 0,
                                authorId: result.authorId,
                                authorFirstName: result.firstName,
                                authorLastName: result.lastName,
                                authorIsAdmin: result.admin,
                                authorEmail: result.email,
                                imgUrl: result.imgUrl,
                                content: result.content,
                                date: result.date,
                                modified: result.modified,
                                likes: result.likes,
                                dislikes: result.dislikes,
                            }}
                            userData={{
                                token: token,
                                admin: data.admin,
                                loggedUserId: data.loggedUserId,
                                currentUserLikeValue:
                                    result.currentUserLikeValue,
                            }}
                            setHasNewPosts={setHasNewPosts}
                        />
                    ));
                }
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) => {
                console.error("Impossible d'afficher les messages :", error);
                setErrorMessage("Impossible d'afficher les messages.");
            });
    }, [hasNewPosts, token, navigate]);

    return (
        <Box
            component="main"
            maxWidth={theme.maxWidth.desktop}
            margin="auto"
            padding="2rem .5rem"
        >
            <Box
                component="section"
                sx={{
                    marginTop: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                <PostNewMessageButton
                    showNewPostForm={showNewPostForm}
                    setShowNewPostForm={setShowNewPostForm}
                />
                {showNewPostForm && (
                    <CreateMessageForm
                        isReply={false}
                        token={token}
                        parentId={0}
                        setHasNewMessages={setHasNewPosts}
                    />
                )}
            </Box>
            <Box
                component="section"
                sx={{
                    marginTop: 8,
                }}
            >
                <Typography component="h1" variant="h4" mb={4}>
                    Messages
                </Typography>
                {posts}
                {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            </Box>
        </Box>
    );
};

export default Home;
