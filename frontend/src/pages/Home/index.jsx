import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import CreatePostForm from "../../components/CreatePostForm";

const Home = () => {
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
                if (data.posts.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    return data.posts.map((post) => (
                        <Post
                            key={post.id}
                            id={post.id}
                            postUserId={post.postUserId}
                            email={post.email}
                            imgUrl={post.imgUrl}
                            content={post.content}
                            date={post.date}
                            likes={post.likesCount}
                            dislikes={post.dislikesCount}
                            admin={data.admin}
                            loggedUserId={data.loggedUserId}
                            setHasNewPosts={setHasNewPosts}
                        />
                    ));
                }
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) => {
                console.error("Impossible d'afficher les messages :", error);
                setErrorMessage("Impossible d'afficher les messages.");
            });
    }, [hasNewPosts, token, navigate]);

    return (
        <React.Fragment>
            <Nav page="Home" />
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
