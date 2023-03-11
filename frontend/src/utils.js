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
 * @param {Function} setHasNewPosts
 * @param {Function} setErrorMessage
 * @returns {Response}
 */

exports.deletePost = (
    token,
    postId,
    imgUrl,
    setHasNewPosts,
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
                    setHasNewPosts((hasNewPosts) => hasNewPosts + 1);
                }
            })
            .catch(() =>
                setErrorMessage("Impossible de supprimer le message.")
            );
    }
};
