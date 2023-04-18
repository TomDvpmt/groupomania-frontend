import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

import Post from "../../components/Cards/Post";
import CreateMessageForm from "../../components/Forms/CreateMessageForm";
import PostNewMessageButton from "../../components/Buttons/PostNewMessageButton";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

// import { forumSetPostsFromDB } from "../../services/features/forum";

import { Box, Typography, Collapse } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Home = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/0`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    sessionStorage.removeItem("token");
                    console.error("Non autorisé.");
                    navigate("/login");
                } else return response.json();
            })
            .then((data) => {
                if (data.results.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    // dispatch(forumSetPostsFromDB(data.results));
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
                            currentUserLikeValue={result.currentUserLikeValue}
                            setHasNewPosts={setHasNewPosts}
                        />
                    ));
                }
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) => {
                console.error("Impossible d'afficher les messages :", error);
                setErrorMessage("Impossible d'afficher les messages.");
            })
            .finally(setLoading(false));
    }, [hasNewPosts, token, navigate]);

    return (
        <>
            <Box
                component="main"
                maxWidth={theme.maxWidth.desktop}
                margin="auto"
                padding="2rem .5rem"
            >
                <Typography component="h2" variant="h4" mb={4}>
                    Forum
                </Typography>
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
                    <Collapse in={showNewPostForm}>
                        <CreateMessageForm
                            isReply={false}
                            parentId={0}
                            setHasNewMessages={setHasNewPosts}
                            setShowNewMessageForm={setShowNewPostForm}
                        />
                    </Collapse>
                </Box>
                {loading ? (
                    <Loader />
                ) : (
                    <Box
                        component="section"
                        sx={{
                            marginTop: 8,
                        }}
                    >
                        {posts}
                        {errorMessage && (
                            <ErrorMessage errorMessage={errorMessage} />
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
};

export default Home;
