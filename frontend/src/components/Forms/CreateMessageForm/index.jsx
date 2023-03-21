import React, { useState } from "react";
import ErrorMessage from "../../ErrorMessage";
import { imgMimeTypes, sanitize } from "../../../utils/formValidation";
import { Box, TextField, Button, Typography } from "@mui/material";
import { theme } from "../../../utils/theme";
import PropTypes from "prop-types";

const CreateMessageForm = ({
    isReply,
    token,
    parentId,
    setHasNewMessages,
    setShowNewMessageForm,
}) => {
    CreateMessageForm.propTypes = {
        isReply: PropTypes.bool,
        token: PropTypes.string,
        parentId: PropTypes.number,
        setHasNewMessages: PropTypes.func,
        setShowNewMessageForm: PropTypes.func,
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [content, setContent] = useState("");
    const [chosenFile, setChosenFile] = useState("");

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
                        e.target.imageFile.value = "";
                        setChosenFile("");
                        setShowNewMessageForm(false);
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
        <Box
            component="form"
            sx={theme.form}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <TextField
                multiline
                autoFocus={isReply}
                label={`Votre ${
                    parentId === 0 ? "message" : "commentaire"
                } :${" "}`}
                name="content"
                id="content"
                fullWidth
                minRows={8}
                margin="normal"
                value={content}
                onChange={handleContentChange}
            />
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

export default CreateMessageForm;
