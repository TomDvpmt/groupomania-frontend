import { useState } from "react";
import { imgMimeTypes, sanitize } from "../../utils/utils";

const UpdateForm = ({
    token,
    postId,
    content,
    setContent,
    imgUrl,
    setShowUpdateForm,
}) => {
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        const uploadedFile = e.target.imageFile.files[0];
        const textInput = e.target.content.value;
        const sanitizedContent = sanitize(textInput);

        setContent(sanitizedContent);

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
                        setShowUpdateForm(false);
                    }
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <>
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
        </>
    );
};

export default UpdateForm;
