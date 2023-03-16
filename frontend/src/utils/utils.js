/**
 *
 * @param {String} endpoint
 * @param {Object} credentialsData
 * @returns {Response}
 */

exports.fetchCredentials = (endpoint, credentialsData) => {
    const response = fetch(
        `${process.env.REACT_APP_BACKEND_URI}/API/auth/${endpoint}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentialsData),
        }
    );
    return response;
};

/**
 *
 * @param {String} input
 * @returns {String}
 */

exports.sanitize = (input) => {
    const htmlCodes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;",
    };
    const regExp = /[&<>"'`=/]/gi;
    return input.replace(regExp, (match) => htmlCodes[match]);
};

exports.imgMimeTypes = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/webp": "webp",
};

/**
 *
 * @param {BigInt} timestamp
 * @returns {String}
 */

exports.formatDate = (timestamp) => {
    const rawDate = new Date(timestamp);
    const hours =
        rawDate.getHours() < 10 ? `0${rawDate.getHours()}` : rawDate.getHours();
    const minutes =
        rawDate.getMinutes() < 10
            ? `0${rawDate.getMinutes()}`
            : rawDate.getMinutes();
    return `Le ${rawDate.toLocaleDateString()} à ${hours}:${minutes}`;
};

/**
 *
 * @param {String} token
 * @param {Number} postId
 * @param {String} imgUrl
 * @param {import("react").SetStateAction} setHasNewMessages
 * @param {import("react").SetStateAction} setErrorMessage
 * @returns {Response}
 */

exports.deletePost = (
    token,
    postId,
    imgUrl,
    setHasNewMessages,
    setErrorMessage
) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
        return;
    } else {
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `BEARER ${token}`,
                "Content-type": "application/json",
            },
            body: JSON.stringify({ imgUrl: imgUrl }),
        })
            .then((response) => {
                if (response.status >= 400) {
                    response
                        .json()
                        .then(({ message }) => setErrorMessage(message));
                } else {
                    setHasNewMessages((hasNewMessages) => hasNewMessages + 1);
                }
            })
            .catch(() =>
                setErrorMessage("Impossible de supprimer le message.")
            );
    }
};

/**
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

exports.setLike = (
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

    fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like`, {
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

/**
 *
 * @param {String} token
 * @param {Number} postId
 * @param {import("react").SetStateAction} setLikeStatus
 */

exports.setUserLikeStatus = (token, postId, setLikeStatus) => {
    fetch(
        `${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like/user`,
        {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        }
    )
        .then((response) => response.json())
        .then((data) => setLikeStatus(data))
        .catch((error) => console.log(error));
};
