import { useState, useEffect } from "react";

const LikeButtons = ({ postId, currentUserLikeValue }) => {
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [likeValue, setLikeValue] = useState(null);
    const [userLikeValue, setUserLikeValue] = useState(currentUserLikeValue);
    const [triggerGetLikes, setTriggerGetLikes] = useState(0);
    const token = localStorage.getItem("token");

    const handleClick = (e) => {
        const clickValue = e.target.dataset.likevalue;
        setLikeValue(clickValue);
        setTriggerGetLikes((triggerGetLikes) => triggerGetLikes + 1);

        if (userLikeValue === 1) {
            if (clickValue === 1) {
                // setlikesCount((likesCount) => likesCount - 1);
                setUserLikeValue(0);
            } else if (clickValue === -1) {
                // setlikesCount((likesCount) => likesCount - 1);
                // setDislikesCount((dislikesCount) => dislikesCount + 1);
                setUserLikeValue(-1);
            }
        } else if (userLikeValue === -1) {
            if (clickValue === 1) {
                // setlikesCount((likesCount) => likesCount + 1);
                // setDislikesCount((dislikesCount) => dislikesCount - 1);
                setUserLikeValue(1);
            } else if (clickValue === -1) {
                // setDislikesCount((dislikesCount) => dislikesCount - 1);
                setUserLikeValue(0);
            }
        } else if (userLikeValue === 0) {
            if (clickValue === 1) {
                // setlikesCount((likesCount) => likesCount + 1);
            } else {
                // setDislikesCount((dislikesCount) => dislikesCount + 1);
            }
            setUserLikeValue(clickValue);
        }
    };

    // ESSAYER LES DEUX FETCH DANS LE MÊME USEEFFECT (ASYNC)

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/likes`,
            {
                method: "GET",
                headers: {
                    Authorization: `BEARER ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setLikesCount(data.likesCount === null ? 0 : data.likesCount);
                setDislikesCount(
                    data.dislikesCount === null ? 0 : data.dislikesCount
                );
            })
            .catch();
    }, [token, postId, triggerGetLikes]);

    useEffect(() => {
        if (likeValue) {
            fetch(
                `${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `BEARER ${token}`,
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ likeValue: likeValue }),
                }
            );
        }
        // .then((response) => console.log(response))
        // .catch((error) => console.log(error));
    }, [postId, token, likeValue, userLikeValue]);

    return (
        <>
            <button onClick={handleClick} data-likevalue={1}>
                Like ({likesCount})
            </button>
            <button onClick={handleClick} data-likevalue={-1}>
                Dislike ({dislikesCount})
            </button>
        </>
    );
};

export default LikeButtons;
