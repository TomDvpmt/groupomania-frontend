import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import Post from "../../components/Post";
import PostForm from "../../components/PostForm";

const Home = () => {
    const [posts, setPosts] = useState([]);

    const token = localStorage.getItem("token");
    console.log("token in storage :", localStorage.getItem("token"));

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/post`, {
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                return data.map((post) => (
                    <Post
                        key={post.id}
                        userEmail={post.userEmail}
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
    }, []);

    return (
        <React.Fragment>
            <Nav />
            <h2>Poster un message :</h2>
            <PostForm />
            <h2>Posts :</h2>
            {posts}
        </React.Fragment>
    );
};

export default Home;
