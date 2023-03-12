/**
 *
 * @param {String} token
 * @param {Number} parentId
 * @param {Function} navigate
 * @param {import("react").SetStateAction} setHasNewMessages
 * @param {import("react").SetStateAction} setMessages
 * @param {import("react").SetStateAction} setErrorMessage
 */

exports.getAllMessagesProps = async (
    token,
    parentId,
    navigate,
    setHasNewMessages,
    setMessages,
    setErrorMessage
) => {
    fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/all/${parentId}`, {
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
            if (data.results.length === 0) {
                return `<p>
                        Aucun ${parentId === 0 ? "message" : "commentaire"} à
                        afficher.
                    </p>`;
            } else {
                return data.results.map(
                    (result) =>
                        parentId === 0
                            ? {
                                  key: result.id,
                                  id: result.id,
                                  postUserId: result.postUserId,
                                  email: result.email,
                                  imgUrl: result.imgUrl,
                                  content: result.content,
                                  date: result.date,
                                  likes:
                                      result.likesCount === null
                                          ? 0
                                          : result.likesCount,
                                  dislikes:
                                      result.dislikesCount === null
                                          ? 0
                                          : result.dislikesCount,
                                  admin: data.admin,
                                  loggedUserId: data.loggedUserId,
                                  setHasNewMessages: setHasNewMessages,
                              }
                            : {
                                  key: result.id,
                                  id: result.id,
                                  commentUserId: result.commentUserId,
                                  email: result.email,
                                  imgUrl: result.imgUrl,
                                  content: result.content,
                                  date: result.date,
                                  likes:
                                      result.likesCount === null
                                          ? 0
                                          : result.likesCount,
                                  dislikes:
                                      result.dislikesCount === null
                                          ? 0
                                          : result.dislikesCount,
                                  admin: data.admin,
                                  loggedUserId: data.loggedUserId,
                                  setHasNewMessages: setHasNewMessages,
                              }
                    // parentId === 0 ? (
                    //     <Message
                    //         key={result.id}
                    //         id={result.id}
                    //         postUserId={result.postUserId}
                    //         email={result.email}
                    //         imgUrl={result.imgUrl}
                    //         content={result.content}
                    //         date={result.date}
                    //         likes={
                    //             result.likesCount === null
                    //                 ? 0
                    //                 : result.likesCount
                    //         }
                    //         dislikes={
                    //             result.dislikesCount === null
                    //                 ? 0
                    //                 : result.dislikesCount
                    //         }
                    //         admin={data.admin}
                    //         loggedUserId={data.loggedUserId}
                    //         setHasNewMessages={setHasNewMessages}
                    //     />
                    // ) : (
                    //     <Message
                    //         key={result.id}
                    //         id={result.id}
                    //         commentUserId={result.commentUserId}
                    //         email={result.email}
                    //         imgUrl={result.imgUrl}
                    //         content={result.content}
                    //         date={result.date}
                    //         likes={
                    //             result.likesCount === null
                    //                 ? 0
                    //                 : result.likesCount
                    //         }
                    //         dislikes={
                    //             result.dislikesCount === null
                    //                 ? 0
                    //                 : result.dislikesCount
                    //         }
                    //         admin={data.admin}
                    //         loggedUserId={data.loggedUserId}
                    //         setHasNewMessages={setHasNewMessages}
                    //     />
                    // )
                );
            }
        })
        .then((results) => {
            console.log("results received :", results);
            return results;
        })
        .catch((error) => {
            console.error(
                `Impossible d'afficher les ${
                    parentId === 0 ? "messages" : "commentaires"
                } :`,
                error
            );
            setErrorMessage("Impossible d'afficher les messages.");
        });
};
