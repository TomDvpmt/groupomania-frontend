import React, { useState } from "react";
import { imgMimeTypes } from "../../utils";

const { sanitize } = require("../../utils");

const PostForm = ({ token, hasNewPosts, setHasNewPosts }) => {
    const [errorMessage, setErrorMessage] = useState("");

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
            const textInput = e.target.content.value;
            const sanitizedContent = sanitize(textInput);

            const formData = new FormData();
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
                        setHasNewPosts((hasNewPosts) => hasNewPosts + 1);
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="content">Votre message : </label>
                <br />
                <textarea
                    name="content"
                    id="content"
                    cols="30"
                    rows="10"
                ></textarea>
                <br />
                <label htmlFor="imageFile">Ajouter une image : </label>
                <input type="file" name="imageFile" />
                <br />
                <button>Envoyer</button>
            </form>
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </React.Fragment>
    );
};

export default PostForm;
