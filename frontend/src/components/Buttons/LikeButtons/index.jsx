import { useState } from "react";
import ErrorMessage from "../../ErrorMessage";
import { Box, Button } from "@mui/material";
import {
    ThumbUpAltOutlined,
    ThumbUp,
    ThumbDownAltOutlined,
    ThumbDown,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const LikeButtons = ({ postId, likes, dislikes, currentUserLikeValue }) => {
    LikeButtons.propTypes = {
        postId: PropTypes.number,
        likes: PropTypes.number,
        dislikes: PropTypes.number,
        currentUserLikeValue: PropTypes.number,
    };

    const token = sessionStorage.getItem("token");

    const [likesCount, setLikesCount] = useState(likes);
    const [dislikesCount, setDislikesCount] = useState(dislikes);
    const [likeStatus, setLikeStatus] = useState(currentUserLikeValue);
    const [errorMessage, setErrorMessage] = useState("");

    const changeLike = (clickValue) => {
        setErrorMessage("");

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like`, {
            method: "PUT",
            headers: {
                Authorization: `BEARER ${token}`,
                "Content-type": "application/json",
            },
            body: JSON.stringify({ clickValue: clickValue }),
        })
            .then((response) => response.json())
            .then((data) => {
                setLikeStatus(data.newUserLikeValue);
                setLikesCount(data.newLikesCount);
                setDislikesCount(data.newDislikesCount);
            })
            .catch((error) => {
                console.log("Like / dislike impossible : ", error);
                setErrorMessage("Like / dislike impossible.");
            });
    };

    const handleLike = () => {
        changeLike(1);
    };

    const handleDislike = () => {
        changeLike(-1);
    };

    return (
        <>
            <Box
                sx={{
                    padding: 1,
                    display: "flex",
                    gap: 1,
                }}
            >
                <Button
                    variant="text"
                    onClick={handleLike}
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        padding: 0,
                        minWidth: "2.5rem",
                    }}
                >
                    {likeStatus === 1 ? (
                        <ThumbUp />
                    ) : (
                        <ThumbUpAltOutlined fontSize="small" />
                    )}
                    {likesCount}
                </Button>
                <Button
                    variant="text"
                    onClick={handleDislike}
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        padding: 0,
                        minWidth: "2.5rem",
                    }}
                >
                    {likeStatus === -1 ? (
                        <ThumbDown />
                    ) : (
                        <ThumbDownAltOutlined fontSize="small" />
                    )}
                    {dislikesCount}
                </Button>
            </Box>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </>
    );
};

export default LikeButtons;
