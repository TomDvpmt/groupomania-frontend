import React, { useState } from "react";
import { sanitize } from "../../utils";
import { useNavigate } from "react-router-dom";
import { imgMimeTypes } from "../../utils";

const UpdateFormPost = ({ postId, content, imgUrl, token }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

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
                        navigate("/");
                    }
                })
                .catch((error) => console.log(error));
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
                    defaultValue={content}
                ></textarea>
                {imgUrl && <img src={imgUrl} alt="Illustration du post" />}
                <br />
                <label htmlFor="imageFile">
                    {imgUrl ? "Changer l'image : " : "Joindre une image : "}
                </label>
                <input type="file" name="imageFile" />
                <br />
                <button>Mettre à jour</button>
            </form>
            <p className="error-msg">{errorMessage}</p>
        </React.Fragment>
    );
};

export default UpdateFormPost;
