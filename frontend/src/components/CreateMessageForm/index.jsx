import React, { useState } from "react";
import { imgMimeTypes, sanitize } from "../../utils/utils";
import { Box, TextField, Button, Typography } from "@mui/material";
import { myTheme } from "../../utils/theme";

const CreateMessageForm = ({ token, parentId, setHasNewMessages }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [content, setContent] = useState("");

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        const uploadedFile = e.target.imageFile.files[0];

        if (
            uploadedFile &&
            !Object.keys(imgMimeTypes).includes(uploadedFile.type)
        ) {
            setErrorMessage(
                "Seuls les formats .jpg, .jpeg, .png, .bpm et .webp sont acceptés."
            );
        } else {
            const sanitizedContent = sanitize(content);

            const formData = new FormData();
            formData.append("parentId", parentId);
            formData.append("imageFile", uploadedFile);
            formData.append("content", sanitizedContent);

            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts`, {
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
                        setHasNewMessages(
                            (hasNewMessages) => hasNewMessages + 1
                        );
                        setContent("");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setErrorMessage("Impossible de publier le message.");
                });
        }
    };
    return (
        <React.Fragment>
            <Box
                component="form"
                sx={myTheme.form}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <TextField
                    multiline
                    label={`Votre ${
                        parentId === 0 ? "message" : "commentaire"
                    } :${" "}`}
                    name="content"
                    id="content"
                    fullWidth
                    minRows={8}
                    margin="normal"
                    value={content}
                    onChange={handleChange}
                />
                <Button
                    component="label"
                    variant="text"
                    sx={{ alignSelf: "start", mb: 2 }}
                >
                    Ajouter une image
                    <input hidden type="file" name="imageFile" />
                </Button>
                <Button variant="contained">Envoyer</Button>
            </Box>
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </React.Fragment>
    );
};

export default CreateMessageForm;
