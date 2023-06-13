import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ChatUser from "../../components/ChatUser";
import ChatPostForm from "../../components/Forms/ChatPostForm";
import ChatPost from "../../components/ChatPost";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

import { userToggleHasJoinedChat } from "../../services/features/user";
import { pageUpdateLocation } from "../../services/features/page";
import {
    selectUserEmail,
    selectUserFirstName,
    selectUserHasJoinedChat,
    selectUserId,
    selectUserLastName,
    selectChatUsers,
    selectChatAllMessages,
} from "../../services/utils/selectors";

import { Box, Typography, Button } from "@mui/material";
import { theme } from "../../assets/styles/theme";

import { socket } from "../../socket";

const Chat = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = {
        id: useSelector(selectUserId()),
        firstName: useSelector(selectUserFirstName()),
        lastName: useSelector(selectUserLastName()),
        email: useSelector(selectUserEmail()),
    };
    const chatPosts = useSelector(selectChatAllMessages());
    const chatUsers = useSelector(selectChatUsers());
    const hasJoinedChat = useSelector(selectUserHasJoinedChat());

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        dispatch(pageUpdateLocation("chat"));
    }, [dispatch]);

    const toggleChatConnection = () => {
        dispatch(userToggleHasJoinedChat());
    };

    useEffect(() => {
        socket.connect();
    }, []);

    useEffect(() => {
        hasJoinedChat
            ? socket.emit("joinChat", userData)
            : socket.emit("leaveChat", userData);
    }, [hasJoinedChat]);

    useEffect(() => {
        fetch(`/API/chat/`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                socket.emit("sendMessagesFromDB", data);
            })
            .catch((error) => {
                setErrorMessage("Impossible d'afficher les messages.");
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, navigate, dispatch]);

    return (
        <Box
            component="main"
            maxWidth={theme.maxWidth.desktop}
            margin="auto"
            padding="2rem .5rem"
        >
            <Typography
                component="h1"
                variant="h4"
                align="center"
                margin="2rem 0 4rem"
            >
                Chat
            </Typography>
            {errorMessage !== "" && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
            <Button
                variant={hasJoinedChat ? "outlined" : "contained"}
                onClick={toggleChatConnection}
            >
                {hasJoinedChat ? "Se déconnecter" : "Se connecter"}
            </Button>
            <Box
                component="section"
                sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                    padding: 4,
                    border: "1px solid rgba(0, 0, 0, .27)",
                    borderRadius: "4px",
                    display: "flex",
                    gap: "1rem",
                }}
            >
                <Box>
                    <Typography>Utilisateurs connectés&nbsp;:</Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                    {chatUsers.map((user, index) => (
                        <div key={user.id}>
                            <ChatUser user={user} />
                            <Typography component="span">
                                {index < chatUsers.length - 1 && ", "}
                            </Typography>
                        </div>
                    ))}
                </Box>
            </Box>
            {loading ? (
                <Loader />
            ) : (
                <Box
                    component="section"
                    sx={{
                        backgroundColor: "white",
                        marginTop: 4,
                        padding: { xs: 1, sm: 2, md: 3, lg: 4 },
                        border: "1px solid rgba(0, 0, 0, .27)",
                        borderRadius: "4px",
                    }}
                >
                    {chatPosts.length > 0 ? (
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
            )}
            {hasJoinedChat && (
                <Box component="section">
                    <ChatPostForm />
                </Box>
            )}
        </Box>
    );
};

export default Chat;
