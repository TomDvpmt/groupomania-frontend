import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav";
import UpdateFormPost from "../../components/UpdatePostForm";
import { useNavigate } from "react-router-dom";

const UpdatePost = ({ postId }) => {
    const [content, setContent] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (postId === null) navigate("/");
    }, [postId, navigate]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.setItem("token", null);
                    console.error("Non autorisé.");
                    navigate("/login");
                } else return response.json();
            })
            .then((postData) => {
                setContent(postData.content);
                setImgUrl(postData.imgUrl);
            })
            .catch((error) => console.log(error));
    }, [postId, token, navigate]);

    return (
        <React.Fragment>
            <Nav />
            <UpdateFormPost
                postId={postId}
                content={content}
                imgUrl={imgUrl}
                token={token}
            />
        </React.Fragment>
    );
};

export default UpdatePost;
