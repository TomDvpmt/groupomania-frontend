import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import PostForm from "../../components/PostForm";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [authorized, setAuthorized] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token === "null") {
            setAuthorized(false);
        }
    }, [token]);

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
                return data.map((post) => (
                    <Post
                        key={post.id}
                        // userEmail={post.userEmail}
                        imgUrl={post.imgUrl}
                        content={post.content}
                        date={post.date}
                    />
                ));
            })
            .then((postsList) => setPosts(postsList))
            .catch((error) =>
                console.error("Impossible d'afficher les posts :", error)
            );
    }, [hasNewPosts, token]);

    return (
        <React.Fragment>
            <Nav />
            <h2>Poster un message :</h2>
            <PostForm
                token={token}
                hasNewPosts={hasNewPosts}
                setHasNewPosts={setHasNewPosts}
            />
            <h2>Messages :</h2>
            {posts}
        </React.Fragment>
    );
};

export default Home;
