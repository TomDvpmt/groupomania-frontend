import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import ErrorMessage from "../../ErrorMessage";

import {
    chatAddMessage,
    chatRemoveOldest,
} from "../../../services/features/chat";
import {
    selectUserFirstName,
    selectUserLastName,
    selectUserAdminStatus,
    selectUserEmail,
    selectChatLimit,
    selectChatAllMessages,
} from "../../../services/utils/selectors";

import { imgMimeTypes, sanitize } from "../../../utils/formValidation";

import { Box, TextField, Button, Typography } from "@mui/material";

import { socket } from "../../../socket";

const ChatPostForm = () => {
    const token = sessionStorage.getItem("token");
    const dispatch = useDispatch();

    const chatLimit = useSelector(selectChatLimit());
    const chatPosts = useSelector(selectChatAllMessages());
    const admin = useSelector(selectUserAdminStatus());
    const firstName = useSelector(selectUserFirstName());
    const lastName = useSelector(selectUserLastName());
    const email = useSelector(selectUserEmail());

    const [content, setContent] = useState("");
    const [chosenFile, setChosenFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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

            fetch(`/API/chat/`, {
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
                            chatPosts.length === chatLimit &&
                                dispatch(chatRemoveOldest());

                            const chatMessage = {
                                authorIsAdmin: admin,
                                firstName,
                                lastName,
                                email,
                                content: sanitizedContent,
                                imgUrl: data.imgUrl || "",
                                moderation: 0,
                                alert: 0,
                                createdAt,
                            };

                            dispatch(chatAddMessage(chatMessage));

                            socket.emit("sendMessage", chatMessage);

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
            component="form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <TextField
                autoFocus
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
    );
};

export default ChatPostForm;
