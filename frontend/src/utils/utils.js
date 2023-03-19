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
                response.json().then(({ message }) => setErrorMessage(message));
            } else {
                setHasNewMessages((hasNewMessages) => hasNewMessages + 1);
            }
        })
        .catch((error) => {
            console.error("Impossible de supprimer le message : ", error);
            setErrorMessage("Impossible de supprimer le message.");
        });
};

/**
 *
 * @param {String} updateContent
 * @param {String} imgUrl
 * @param {Number} postId
 * @param {String} token
 * @param {import("react").SetStateAction} setShowUpdateForm
 * @param {import("react").SetStateAction} setHasNewMessages
 * @param {import("react").SetStateAction} setErrorMessage
 */

exports.deleteImage = (
    updateContent,
    imgUrl,
    postId,
    token,
    setShowUpdateForm,
    setHasNewMessages,
    setErrorMessage
) => {
    const content = updateContent;
    const formData = new FormData();

    formData.append("content", content);
    formData.append("imgUrl", imgUrl);
    formData.append("deleteImg", true);

    fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}`, {
        method: "PUT",
        headers: {
            Authorization: `BEARER ${token}`,
        },
        body: formData,
    })
        .then((response) => {
            if (response.status >= 400) {
                response.json().then(({ message }) => setErrorMessage(message));
            } else {
                setShowUpdateForm(false);
                setHasNewMessages((hasNewMessages) => hasNewMessages + 1);
            }
        })
        .catch((error) => {
            setErrorMessage("Impossible de modifier le message.");
            console.error("Impossible de modifier le message : ", error);
        });
};

/**
 *
 * @param {String} token
 * @param {Number} userId
 * @param {import("react").SetStateAction} setErrorMessage
 * @param {Function} navigate
 */

exports.deleteUser = (token, userId, setErrorMessage, navigate) => {
    fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `BEARER ${token}`,
        },
    })
        .then((response) => {
            if (response.status >= 400) {
                response.json().then(({ message }) => setErrorMessage(message));
            } else {
                localStorage.setItem("token", null);
                navigate("/login");
            }
        })
        .catch((error) => {
            console.error("Impossible de supprimer l'utilisateur : ", error);
            setErrorMessage("Impossible de supprimer le compte.");
        });
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

/**
 * Tests if string input by user matches a regex
 *
 * @param { String } inputName
 * @param { String } stringToTest
 * @returns { Boolean }
 */

exports.setInputErrorMessages = (fields) => {
    fields.forEach((field) => {
        if (field.errors.isEmpty.condition) {
            field.errorSetter(field.errors.isEmpty.message);
        } else if (field.errors.isInvalid.condition) {
            field.errorSetter(field.errors.isInvalid.message);
        }
    });
};

exports.checkInputErrors = (fields) => {
    let hasErrors = 0;
    fields.forEach((field) => {
        field.errors.isEmpty.condition && hasErrors++;
        field.errors.isInvalid.condition && hasErrors++;
    });
    return hasErrors;
};

exports.isValidInput = (inputName, stringToTest) => {
    const nameRegex = new RegExp(
        "(^[a-zà-ÿ][a-zà-ÿ-']?)+([a-zà-ÿ-' ]+)?[a-zà-ÿ']$",
        "i"
    );
    const emailRegex = new RegExp(
        "^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$" // double escapes because the RegExp is created by a string
    );
    const regexs = {
        firstName: nameRegex,
        lastName: nameRegex,
        email: emailRegex,
    };
    return regexs[inputName].test(stringToTest);
};
