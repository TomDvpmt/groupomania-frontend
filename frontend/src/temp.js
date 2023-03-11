exports.fetchAll = (
    parentId,
    token,
    setComments,
    setHasNewPosts,
    setHasNewComments,
    setErrorMessage
) => {
    fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/${parentId}`, {
        method: "GET",
        headers: {
            Authorization: `BEARER ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("DATA : ", data);
            if (data.posts.length === 0) {
                return <p>Aucun message à afficher.</p>;
            } else {
                return data.posts.map((result) =>
                    parentId === 0 ? (
                        <Post
                            key={result.id}
                            id={result.id}
                            postUserId={result.postUserId}
                            email={result.email}
                            imgUrl={result.imgUrl}
                            content={result.content}
                            date={result.date}
                            likes={
                                result.likesCount === null
                                    ? 0
                                    : result.likesCount
                            }
                            dislikes={
                                result.dislikesCount === null
                                    ? 0
                                    : result.dislikesCount
                            }
                            admin={data.admin}
                            loggedUserId={data.loggedUserId}
                            setHasNewPosts={setHasNewPosts}
                        />
                    ) : (
                        <Comment
                            key={result.id}
                            id={result.id}
                            commentUserId={result.postUserId}
                            email={result.email}
                            imgUrl={result.imgUrl}
                            content={result.content}
                            date={result.date}
                            likes={
                                result.likesCount === null
                                    ? 0
                                    : result.likesCount
                            }
                            dislikes={
                                result.dislikesCount === null
                                    ? 0
                                    : result.dislikesCount
                            }
                            admin={data.admin}
                            loggedUserId={data.loggedUserId}
                            setHasNewComments={setHasNewComments}
                        />
                    )
                );
            }
        })
        .then((commentsList) => setComments(commentsList))
        .catch((error) => {
            console.error("Impossible d'afficher les messages :", error);
            setErrorMessage("Impossible d'afficher les messages.");
        });
};
