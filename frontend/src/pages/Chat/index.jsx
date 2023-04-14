import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import store from "../../utils/store";
import { setPostsFromDB } from "../../features/chat";
import { addChatPost } from "../../features/chat";
import { selectChatPosts } from "../../utils/selectors";

import ChatPost from "../../components/ChatPost";
import ErrorMessage from "../../components/ErrorMessage";

import { imgMimeTypes, sanitize } from "../../utils/formValidation";

import { Box, TextField, Button, Typography } from "@mui/material";
import { theme } from "../../utils/theme";

const Chat = () => {
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const chatPosts = useSelector(selectChatPosts());

    const [errorMessage, setErrorMessage] = useState("");
    const [content, setContent] = useState("");
    const [chosenFile, setChosenFile] = useState("");

    useEffect(() => {
        setLoading(true);
        !token && navigate("/login");

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => store.dispatch(setPostsFromDB(data)))
            .catch((error) => console.log(error))
            .finally(setLoading(false));
    }, []);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleFileChange = (e) => {
        e.target.files[0]
            ? setChosenFile(`Image choisie : "${e.target.files[0].name}"`)
            : setChosenFile("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        const firstName = localStorage.getItem("firstName");
        const lastName = localStorage.getItem("lastName");
        const uploadedFile = e.target.imageFile.files[0];

        if (!uploadedFile && !content) {
            setErrorMessage("Le message ne peut pas être vide.");
            return;
        } else if (
            uploadedFile &&
            !Object.keys(imgMimeTypes).includes(uploadedFile.type)
        ) {
            setErrorMessage(
                "Seuls les formats d'image .jpg, .jpeg, .png, .bpm et .webp sont acceptés."
            );
        } else {
            const sanitizedContent = sanitize(content);
            const createdAt = Date.now();

            const formData = new FormData();
            formData.append("imageFile", uploadedFile);
            formData.append("content", sanitizedContent);
            formData.append("createdAt", createdAt);

            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/`, {
                method: "POST",
                headers: {
                    Authorization: `BEARER ${token}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) => setErrorMessage(message));
                    } else {
                        response.json().then((data) => {
                            store.dispatch(
                                addChatPost({
                                    firstName,
                                    lastName,
                                    content: sanitizedContent,
                                    imgUrl: data.imgUrl || "",
                                    moderated: 0,
                                    createdAt,
                                })
                            );
                            e.target.imageFile.value = "";
                            setChosenFile("");
                            setContent("");
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Impossible de publier le message.");
                });
        }
    };

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
            <Box
                component="section"
                sx={{
                    maxHeight: "100vh",
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
                        .sort((a, b) => a.createdAt - b.createdAt)
                        .map((post, index) => (
                            <ChatPost key={index} post={post} />
                        ))
                ) : (
                    <p>Aucun message à afficher.</p>
                )}
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <TextField
                    autoFocus={chatPosts.length === 0}
                    multiline
                    name="content"
                    id="content"
                    label="Votre message : "
                    fullWidth
                    minRows={4}
                    margin="normal"
                    value={content}
                    onChange={handleContentChange}
                ></TextField>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Button
                        component="label"
                        variant="text"
                        sx={{ alignSelf: "start" }}
                    >
                        Ajouter une image
                        <input
                            hidden
                            type="file"
                            name="imageFile"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ fontWeight: "700" }}
                    >
                        Envoyer
                    </Button>
                </Box>
                <Typography paragraph variant="body2">
                    {chosenFile}
                </Typography>
                {errorMessage !== "" && (
                    <ErrorMessage errorMessage={errorMessage} />
                )}
            </Box>
        </Box>
    );
};

export default Chat;
