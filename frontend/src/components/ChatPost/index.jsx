import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ErrorMessage from "../ErrorMessage";

import { chatModerate, chatAlert } from "../../services/features/chat";
import {
    selectUserAdminStatus,
    selectChatMessageModeration,
    selectChatMessageAlert,
} from "../../services/utils/selectors";

import { Box, Typography, Button } from "@mui/material";
import { theme } from "../../assets/styles/theme";

import PropTypes from "prop-types";

import styled from "@emotion/styled";

const StyledImgContainer = styled.div`
    grid-column: 1 / 3;
    padding: 1rem;
    display: flex;
    justify-content: center;

    img {
        max-width: 100%;
    }
`;

const adminAlertStyle = {
    backgroundColor: theme.palette.primary.light,
    margin: "1rem",
    padding: "3rem",
    color: theme.palette.primary.main,
    fontSize: "1.2rem",
};

const ChatPost = ({ postIndex, post }) => {
    ChatPost.propTypes = {
        postIndex: PropTypes.number,
        post: PropTypes.object,
    };

    const token = sessionStorage.getItem("token");

    const dispatch = useDispatch();
    const admin = useSelector(selectUserAdminStatus());
    const moderation = useSelector(selectChatMessageModeration(postIndex));
    const alert = useSelector(selectChatMessageAlert(postIndex));

    const authorFullName =
        post.firstName || post.lastName
            ? `${post.firstName}${post.firstName && post.lastName ? " " : ""}${
                  post.lastName
              }`
            : "(Anonyme)";

    const authorIsAdmin = post.authorIsAdmin;

    // const [isAdminAlert, setIsAdminAlert] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const updatePost = (propertyName, property) => {
        const updatedValue = property === 0 ? 1 : 0;

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `BEARER ${token}`,
            },
            body: JSON.stringify({
                index: postIndex,
                property: propertyName,
                updatedValue: updatedValue,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    dispatch(
                        propertyName === "moderation"
                            ? chatModerate({
                                  index: postIndex,
                                  moderation: updatedValue,
                              })
                            : chatAlert({
                                  index: postIndex,
                                  alert: updatedValue,
                              })
                    );
                    setErrorMessage("");
                } else {
                    setErrorMessage("Impossible de mettre à jour le message.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleModerate = () => {
        updatePost("moderation", moderation);

        // const updatedValue = moderation === 0 ? 1 : 0;

        // fetch(`${process.env.REACT_APP_BACKEND_URI}/API/chat/update`, {
        //     method: "PUT",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `BEARER ${token}`,
        //     },
        //     body: JSON.stringify({
        //         index: postIndex,
        //         property: "moderation",
        //         updatedValue: updatedValue,
        //     }),
        // })
        //     .then((response) => {
        //         if (response.ok) {
        //             dispatch(
        //                 chatModerate({
        //                     index: postIndex,
        //                     moderation: updatedValue,
        //                 })
        //             );
        //             setErrorMessage("");
        //         } else {
        //             setErrorMessage("Impossible de mettre à jour le message.");
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
    };

    const handleAlert = () => {
        updatePost("alert", alert);

        // setIsAdminAlert((isAdminAlert) => !isAdminAlert);
    };

    return (
        <>
            <Box
                component="article"
                sx={{
                    margin: authorIsAdmin && ".5rem 1rem .5rem 0",
                    padding: ".1rem",
                }}
            >
                <Typography
                    component="h2"
                    variant="body1"
                    mr="1rem"
                    color={"primary"}
                    sx={{
                        padding: authorIsAdmin && "0 .3rem",
                        marginTop: admin && "2px",
                        bgcolor: authorIsAdmin && theme.palette.primary.light,
                        display: "inline-block",
                        fontWeight: "700",
                        "& a": {
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                        },
                    }}
                >
                    {authorIsAdmin === 0 ? (
                        <Link to={`/users/${post.authorId}`}>
                            {authorFullName} :
                        </Link>
                    ) : (
                        <span>{authorFullName} :</span>
                    )}
                </Typography>
                {admin === 1 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleModerate}
                        sx={{ mr: 2 }}
                    >
                        {moderation ? "Rétablir" : "Modérer"}
                    </Button>
                )}
                {admin === 1 && authorIsAdmin === 1 && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAlert}
                        sx={{ mr: 2 }}
                    >
                        {alert ? "Normal" : "Alerte"}
                    </Button>
                )}
                {moderation === 1 ? (
                    <Typography
                        component="span"
                        color={theme.palette.text.light}
                    >
                        {"<MESSAGE MODÉRÉ>"}
                    </Typography>
                ) : (
                    <Typography
                        sx={
                            alert
                                ? adminAlertStyle
                                : { display: "inline-block" }
                        }
                    >
                        {post.content}
                    </Typography>
                )}
                {post.imgUrl !== "" && moderation === 0 && (
                    <StyledImgContainer>
                        <img src={post.imgUrl} alt="Illustration du post" />
                    </StyledImgContainer>
                )}
            </Box>
            {errorMessage !== "" && (
                <ErrorMessage errorMessage={errorMessage} />
            )}
        </>
    );
};

export default ChatPost;
