const PostForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="content">Votre message : </label>
            <br />
            <textarea
                name="content"
                id="content"
                cols="30"
                rows="10"
            ></textarea>
            <br />
            <label htmlFor="fileUpload">Ajouter une image : </label>
            <input type="file" name="fileUpload" id="fileUpload" />
            <br />
            <button>Envoyer</button>
        </form>
    );
};

export default PostForm;
