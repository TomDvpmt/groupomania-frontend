import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ChatUser from "../../components/ChatUser";
import ChatPostForm from "../../components/Forms/ChatPostForm";
import ChatPost from "../../components/ChatPost";
import ErrorMessage from "../../components/ErrorMessage";

import { pageUpdateLocation } from "../../services/features/page";
import {
    selectAllChatMessages,
    selectChatUsers,
    selectUserEmail,
    selectUserFirstName,
    selectUserId,
    selectUserLastName,
} from "../../services/utils/selectors";

import { Box, Typography } from "@mui/material";
import { theme } from "../../assets/styles/theme";

import { socket } from "../../socket";

const Chat = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const chatUserData = {
        id: useSelector(selectUserId()),
        firstName: useSelector(selectUserFirstName()),
        lastName: useSelector(selectUserLastName()),
        email: useSelector(selectUserEmail()),
    };
    const chatPosts = useSelector(selectAllChatMessages());
    const chatUsers = useSelector(selectChatUsers());

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        dispatch(pageUpdateLocation("chat"));
    }, [dispatch]);

    useEffect(() => {
        socket.connect();
        socket.emit("sendUserData", chatUserData);
    }, []);

    useEffect(() => {
        fetch(`/API/chat/`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("sends socket message to server");
                socket.emit("sendMessagesFromDB", data);
            })
            .catch((error) => {
                setErrorMessage("Impossible d'afficher les messages.");
                console.log(error);
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
                component="h2"
                variant="h4"
                align="center"
                margin="2rem 0 4rem"
            >
                Chat
            </Typography>
            {errorMessage !== "" && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
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
                    <Typography>Utilisateurs connectés :</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: ".5rem" }}>
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
            <Box
                component="section"
                sx={{
                    backgroundColor: "white",
                    marginTop: 4,
                    padding: 4,
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
            <Box component="section">
                <ChatPostForm />
            </Box>
        </Box>
    );
};

export default Chat;
