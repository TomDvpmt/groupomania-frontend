import React, { useEffect, useState } from "react";
import Post from "../../components/Post";
import PostForm from "../../components/PostForm";

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/post`)
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
            .catch((error) => console.log(error));
    }, []);

    return (
        <React.Fragment>
            <h2>Poster un message :</h2>
            <PostForm />
            <h2>Posts :</h2>
            {posts}
        </React.Fragment>
    );
};

export default Home;
