const LikeButtons = ({
    postId,
    likesCount,
    dislikesCount,
    setLikesCount,
    setDislikesCount,
}) => {
    const token = localStorage.getItem("token");

    const handleLike = (e) => {
        const likeValue = e.target.dataset.likevalue;

        // check userLikeStatus => setLikesCount / setDislikesCount

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like`, {
            method: "PUT",
            headers: {
                Authorization: `BEARER ${token}`,
                "Content-type": "application/json",
            },
            body: JSON.stringify({ likeValue: likeValue }),
        })
            // .then((response) => response.json())
            // .then((data) => console.log(data))
            .catch((error) => console.log(error));
    };

    return (
        <>
            <button onClick={handleLike} data-likevalue={1}>
                Like ({likesCount})
            </button>
            <button onClick={handleLike} data-likevalue={-1}>
                Dislike ({dislikesCount})
            </button>
        </>
    );
};

export default LikeButtons;
