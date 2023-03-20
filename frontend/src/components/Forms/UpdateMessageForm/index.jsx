import { useState } from "react";
import { imgMimeTypes, sanitize } from "../../../utils/utils";
import AlertDialog from "../../AlertDialog";
import ErrorMessage from "../../ErrorMessage";
import { Box, TextField, Button, Typography } from "@mui/material";
import { theme } from "../../../utils/theme";
import PropTypes from "prop-types";

const UpdateMessageForm = ({
    token,
    postId,
    parentId,
    prevContent,
    setMessageContent,
    imgUrl,
    setShowUpdateForm,
    setHasNewMessages,
}) => {
    UpdateMessageForm.propTypes = {
        token: PropTypes.string,
        postId: PropTypes.number,
        parentId: PropTypes.number,
        prevContent: PropTypes.string,
        setMessageContent: PropTypes.func,
        imgUrl: PropTypes.string,
        setShowUpdateForm: PropTypes.func,
        setHasNewMessages: PropTypes.func,
    };

    const [updateContent, setUpdateContent] = useState(prevContent);
    const [chosenFile, setChosenFile] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleContentChange = (e) => {
        setUpdateContent(e.target.value);
    };

    const handleFileChange = (e) => {
        e.target.files[0]
            ? setChosenFile(`Image choisie : "${e.target.files[0].name}"`)
            : setChosenFile("");
    };

    const handleFileDelete = () => {
        setShowAlert(true);
    };

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
            id="update-form"
            component="form"
            sx={theme.form}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <TextField
                margin="normal"
                fullWidth
                multiline
                rows={15}
                autoFocus
                label={`Votre ${
                    parentId === 0 ? "message" : "commentaire"
                } :${" "}`}
                name="content"
                id="content"
                value={updateContent}
                onChange={handleContentChange}
            />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
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
                        variant="text"
                        size="small"
                        onClick={handleFileDelete}
                    >
                        Supprimer l'image
                    </Button>
                )}
                {showAlert && (
                    <AlertDialog
                        issue="image"
                        token={token}
                        issueId={postId}
                        updateContent={updateContent}
                        imgUrl={imgUrl}
                        setHasNewMessages={setHasNewMessages}
                        setShowUpdateForm={setShowUpdateForm}
                        setErrorMessage={setErrorMessage}
                        showAlert={showAlert}
                        setShowAlert={setShowAlert}
                    />
                )}
            </Box>
            <Typography variant="body2">{chosenFile}</Typography>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Mettre à jour
            </Button>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </Box>
    );
};

export default UpdateMessageForm;
