import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import CreatePostForm from "../../components/CreatePostForm";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [authorized, setAuthorized] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token === (null || "null")) {
            setAuthorized(false);
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!authorized) {
            localStorage.setItem("token", null);
            navigate("/login");
        }
    }, [authorized, navigate]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/post`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                console.log(data.admin);
                return data.posts.map((post) => (
                    <Post
                        key={post.id}
                        postUserId={post.postUserId}
                        email={post.email}
                        imgUrl={post.imgUrl}
                        content={post.content}
                        date={post.date}
                        admin={data.admin}
                        loggedUserId={data.loggedUserId}
                    />
                ));
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) => {
                console.error("Impossible d'afficher les messages :", error);
                setErrorMessage("Impossible d'afficher les messages.");
            });
    }, [hasNewPosts, token]);

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
