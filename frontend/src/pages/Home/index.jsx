import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import CreatePostForm from "../../components/CreatePostForm";

const Home = ({ setPostId }) => {
    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts`, {
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
            .then((data) => {
                return data.posts.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        postUserId={post.postUserId}
                        email={post.email}
                        imgUrl={post.imgUrl}
                        content={post.content}
                        date={post.date}
                        admin={data.admin}
                        loggedUserId={data.loggedUserId}
                        setPostId={setPostId}
                    />
                ));
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) => {
                console.error("Impossible d'afficher les messages :", error);
                setErrorMessage("Impossible d'afficher les messages.");
            });
    }, [hasNewPosts, token, navigate, setPostId]);

    return (
        <React.Fragment>
            <Nav />
            <h2>Poster un message :</h2>
            <CreatePostForm
                token={token}
                hasNewPosts={hasNewPosts}
                setHasNewPosts={setHasNewPosts}
            />
            <h2>Messages :</h2>
            {posts}
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </React.Fragment>
    );
};

export default Home;
