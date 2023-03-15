import { useState } from "react";
import { imgMimeTypes, sanitize } from "../../utils/utils";
import ErrorMessage from "../ErrorMessage";
import { Box, TextField, Button, Typography } from "@mui/material";
import { myTheme } from "../../utils/theme";

const UpdateForm = ({
    token,
    postId,
    parentId,
    prevContent,
    setMessageContent,
    imgUrl,
    setShowUpdateForm,
    setHasNewMessages,
}) => {
    const [updateContent, setUpdateContent] = useState(prevContent);
    const [chosenFile, setChosenFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleContentChange = (e) => {
        setUpdateContent(e.target.value);
    };

    const handleFileChange = (e) => {
        e.target.files[0]
            ? setChosenFile(`Image choisie : "${e.target.files[0].name}"`)
            : setChosenFile("");
    };

    const handleFileDelete = (e) => {};

    const handleSubmit = (e) => {
        e.preventDefault();

        const uploadedFile = e.target.imageFile.files[0];
        const textInput = e.target.content.value;
        const sanitizedContent = sanitize(textInput);

        if (
            uploadedFile &&
            !Object.keys(imgMimeTypes).includes(uploadedFile.type)
        ) {
            setErrorMessage(
                "Seuls les formats .jpg, .jpeg, .png, .bpm et .webp sont acceptés."
            );
        } else {
            const formData = new FormData();
            uploadedFile && formData.append("imageFile", uploadedFile);
            formData.append("content", sanitizedContent);
            imgUrl && formData.append("imgUrl", imgUrl);

            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}`, {
                method: "PUT",
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
                        setMessageContent(sanitizedContent);
                        setShowUpdateForm(false);
                        setHasNewMessages(
                            (hasNewMessages) => hasNewMessages + 1
                        );
                    }
                })
                .catch((error) => {
                    console.log("Impossible de modifier le message : ", error);
                });
        }
    };

    return (
        <Box
            component="form"
            sx={myTheme.form}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <TextField
                multiline
                autoFocus
                label={`Votre ${
                    parentId === 0 ? "message" : "commentaire"
                } :${" "}`}
                name="content"
                id="content"
                fullWidth
                minRows={8}
                margin="normal"
                value={updateContent}
                onChange={handleContentChange}
            />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Button component="label" variant="text" size="small">
                    {imgUrl ? "Changer l'image" : "Ajouter une image"}
                    <input
                        hidden
                        type="file"
                        name="imageFile"
                        onChange={handleFileChange}
                    />
                </Button>
                {imgUrl && (
                    <Button
                        component="label"
                        variant="text"
                        size="small"
                        onClick={handleFileDelete}
                    >
                        Supprimer l'image
                    </Button>
                )}
                <Typography variant="body2">{chosenFile}</Typography>
            </Box>
            <Button type="submit" variant="contained">
                Mettre à jour
            </Button>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </Box>
    );
};

export default UpdateForm;
