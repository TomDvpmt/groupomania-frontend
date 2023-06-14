import store from "../services/utils/store";
import { userLogOut } from "../services/features/user";
import { postDelete } from "../services/features/posts";
import { postCommentDelete } from "../services/features/posts";

/** Sends credentials (for login and signup requests)
 *
 * @param {String} endpoint
 * @param {Object} credentialsData
 * @returns {Response}
 */

export const fetchCredentials = (endpoint, credentialsData) => {
    const response = fetch(`/API/auth/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentialsData),
    });
    return response;
};

/** Sends a request to delete a message (post or comment)
 *
 * @param {String} token
 * @param {Number} postId
 * @param {String} imgUrl
 * @param {import("react").SetStateAction} setHasNewMessages
 * @param {import("react").SetStateAction} setErrorMessage
 * @returns {Response}
 */

export const deleteMessage = (
    token,
    issue,
    messageId,
    parentId,
    imgUrl,
    setHasNewMessages,
    setErrorMessage
) => {
    fetch(`/API/${issue}s/${messageId}`, {
        method: "DELETE",
        headers: {
            Authorization: `BEARER ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({ imgUrl: imgUrl }),
    })
        .then((response) => {
            if (response.status >= 400) {
                response.json().then(({ message }) => setErrorMessage(message));
            } else {
                setHasNewMessages((hasNewMessages) => hasNewMessages + 1);
                issue === "post"
                    ? store.dispatch(postDelete(messageId))
                    : store.dispatch(
                          postCommentDelete({ parentId, commentId: messageId })
                      );
            }
        })
        .catch((error) => {
            console.error("Impossible de supprimer le message : ", error);
            setErrorMessage("Impossible de supprimer le message.");
        });
};

/** Sends a request to delete a user's account
 *
 * @param {String} token
 * @param {Number} userId
 * @param {import("react").SetStateAction} setErrorMessage
 * @param {Function} navigate
 */

export const deleteUser = (token, userId, setErrorMessage, navigate) => {
    fetch(`/API/auth/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `BEARER ${token}`,
        },
    })
        .then((response) => {
            if (response.status >= 400) {
                response.json().then(({ message }) => setErrorMessage(message));
            } else {
                sessionStorage.removeItem("token");
                store.dispatch(userLogOut());
                navigate("/login");
            }
        })
        .catch((error) => {
            console.error("Impossible de supprimer l'utilisateur : ", error);
            setErrorMessage("Impossible de supprimer le compte.");
        });
};

/** Sends a request to add or cancel a like or dislike to a message (post or comment)
 *
 * @param {Event} e
 * @param {String} token
 * @param {Number} postId
 * @param {Function} setPostLikes
 * @param {import("react").SetStateAction} setLikesCount
 * @param {import("react").SetStateAction} setDislikesCount
 * @param {Function} setUserLikeStatus
 * @param {import("react").SetStateAction} setLikeStatus
 * @param {import("react").SetStateAction} setErrorMessage
 */

export const setLike = (
    e,
    token,
    postId,
    setPostLikes,
    setLikesCount,
    setDislikesCount,
    setUserLikeStatus,
    setLikeStatus,
    setErrorMessage
) => {
    const clickValue = e.target.dataset.likevalue;

    fetch(`/API/posts/${postId}/like`, {
        method: "PUT",
        headers: {
            Authorization: `BEARER ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({ likeValue: clickValue }),
    })
        .then((response) => {
            if (response.status >= 400) {
                response.json().then(({ message }) => setErrorMessage(message));
            } else
                setPostLikes(
                    token,
                    postId,
                    setLikesCount,
                    setDislikesCount,
                    setErrorMessage
                );
        })
        .then(() => setUserLikeStatus(token, postId, setLikeStatus))
        .catch(() => setErrorMessage("Like / dislike impossible."));
};

/** Sets the state of a user's like / dislike on a message (post or comment)
 *
 * @param {String} token
 * @param {Number} postId
 * @param {import("react").SetStateAction} setLikeStatus
 */

export const setUserLikeStatus = (token, postId, setLikeStatus) => {
    fetch(`/API/posts/${postId}/like/user`, {
        method: "GET",
        headers: {
            Authorization: `BEARER ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => setLikeStatus(data))
        .catch((error) => console.log(error));
};

/**
 * Get a user's data from the API
 * @param {String} token
 * @returns
 */

export const getUserInfo = async (token) => {
    try {
        const response = await fetch(`/API/auth/0`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        });
        const data = response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};
