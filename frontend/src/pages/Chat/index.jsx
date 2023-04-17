import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ChatPostForm from "../../components/Forms/ChatPostForm";
import ChatPost from "../../components/ChatPost";
import ErrorMessage from "../../components/ErrorMessage";

import store from "../../services/utils/store";
import { chatSetPostsFromDB } from "../../services/features/chat";
import { selectChatPosts } from "../../services/utils/selectors";

import { setUserState } from "../../utils/utils";

import { Box, Typography } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Chat = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setLoading(true);

        setUserState(token, navigate);

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => store.dispatch(chatSetPostsFromDB(data)))
            .catch((error) => {
                setErrorMessage("Impossible d'afficher les messages.");
                console.log(error);
            })
            .finally(setLoading(false));
    }, [token, navigate]);

    const chatPosts = useSelector(selectChatPosts());

    const [loading, setLoading] = useState(false);

    return (
        <Box
            component="main"
            maxWidth={theme.maxWidth.desktop}
            margin="auto"
            padding="2rem .5rem"
        >
            <Typography component="h2" variant="h4" mb={4}>
                Chat
            </Typography>
            {errorMessage !== "" && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
            <Box
                component="section"
                sx={{
                    maxHeight: "300vh",
                    overflowY: "scroll",
                    backgroundColor: "white",
                    marginTop: 4,
                    padding: 4,
                    border: "1px solid rgba(0, 0, 0, .27)",
                    borderRadius: "4px",
                }}
            >
                {!loading && chatPosts.length > 0 ? (
                    chatPosts
                        .slice() // = copy of array, important in strict mode (else error, because original array is freezed (read only))
                        .map((post, index) => (
                            <ChatPost
                                key={index}
                                postIndex={index}
                                post={post}
                            />
                        ))
                ) : (
                    <p>Aucun message à afficher.</p>
                )}
            </Box>
            <Box component="section">
                <ChatPostForm />
            </Box>
        </Box>
    );
};

export default Chat;
