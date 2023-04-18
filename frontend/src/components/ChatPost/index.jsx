import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ErrorMessage from "../ErrorMessage";

import { chatModeratePost } from "../../services/features/chat";
import {
    selectUserAdminStatus,
    selectChatPostModeration,
} from "../../services/utils/selectors";

import { Box, Container, Typography, Button } from "@mui/material";
import { theme } from "../../assets/styles/theme";

import PropTypes from "prop-types";

const ChatPost = ({ postIndex, post }) => {
    ChatPost.propTypes = {
        postIndex: PropTypes.number,
        post: PropTypes.object,
    };

    const token = sessionStorage.getItem("token");

    const dispatch = useDispatch();
    const admin = useSelector(selectUserAdminStatus());
    const moderated = useSelector(selectChatPostModeration(postIndex));

    const authorFullName =
        post.firstName || post.lastName
            ? `${post.firstName}${post.firstName && post.lastName ? " " : ""}${
                  post.lastName
              }`
            : "(Anonyme)";

    const [errorMessage, setErrorMessage] = useState("");

    const handleModerate = () => {
        const newModeratedValue = moderated === 0 ? 1 : 0;

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/moderate`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `BEARER ${token}`,
            },
            body: JSON.stringify({
                index: postIndex,
                setModeratedTo: newModeratedValue,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    dispatch(
                        chatModeratePost({
                            index: postIndex,
                            moderated: newModeratedValue,
                        })
                    );
                    setErrorMessage("");
                } else {
                    setErrorMessage("Impossible de modérer le message.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Box
                component="article"
                sx={{
                    padding: ".1rem",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                }}
            >
                <Typography
                    component="h2"
                    variant="body1"
                    mr={2}
                    pt={admin === 1 && "2px"}
                    color="primary"
                    sx={{
                        gridColumn: "1",
                        justifySelf: "end",
                        fontWeight: "700",
                    }}
                >
                    {authorFullName} :
                </Typography>
                <Box sx={{ gridColumn: "2" }}>
                    {admin === 1 && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleModerate}
                            sx={{ mr: 2 }}
                        >
                            {moderated ? "Rétablir" : "Modérer"}
                        </Button>
                    )}
                    {moderated ? (
                        <Typography
                            component="span"
                            color={theme.palette.text.light}
                        >
                            {"<MESSAGE MODÉRÉ>"}
                        </Typography>
                    ) : (
                        post.content
                    )}
                </Box>
                {post.imgUrl !== "" && !moderated && (
                    <Container
                        sx={{
                            gridColumn: "1 / 3",
                            padding: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <img src={post.imgUrl} alt="Illustration du post" />
                    </Container>
                )}
            </Box>
            {errorMessage !== "" && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
        </>
    );
};

export default ChatPost;
