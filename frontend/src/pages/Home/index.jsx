import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../../components/Post";
import CreateMessageForm from "../../components/CreateMessageForm";

import "./Home.css";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hasNewPosts, setHasNewPosts] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        console.log("===== useEffect de Home => getAllPosts ====");
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/0`, {
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
                console.log("HOME / data : ", data);
                if (data.results.length === 0) {
                    return <p>Aucun message à afficher.</p>;
                } else {
                    return data.results.map((result) => (
                        <Post
                            key={result.id}
                            postData={{
                                id: result.id,
                                parentId: 0,
                                postAuthorId: result.postAuthorId,
                                email: result.email,
                                imgUrl: result.imgUrl,
                                content: result.content,
                                date: result.date,
                                modified: result.modified,
                                likes: result.likes,
                                dislikes: result.dislikes,
                            }}
                            userData={{
                                token: token,
                                admin: data.admin,
                                loggedUserId: data.loggedUserId,
                                currentUserLikeValue:
                                    result.currentUserLikeValue,
                            }}
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
            <h2>Poster un message :</h2>
            <CreateMessageForm
                token={token}
                parentId={0}
                setHasNewMessages={setHasNewPosts}
            />
            <h2>Messages :</h2>
            {posts}
            {errorMessage !== "" && <p className="error-msg">{errorMessage}</p>}
        </React.Fragment>
    );
};

export default Home;
