import { useState, useEffect } from "react";

const Comments = (postId) => {
    const token = localStorage.getItem("token");
    const [comments, setComments] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/comments/${postId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) =>
                response.json().then((data) => console.log(data))
            )
            .catch((error) => console.log(error));
    }, [token, postId]);

    return <section>Comments</section>;
};

export default Comments;
