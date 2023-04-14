import React from "react";

import { Box, Container, Typography } from "@mui/material";

import PropTypes from "prop-types";

const ChatPost = ({ post }) => {
    ChatPost.propTypes = {
        post: PropTypes.object,
    };
    const fullName =
        post.firstName || post.lastName
            ? `${post.firstName}${post.firstName && post.lastName ? " " : ""}${
                  post.lastName
              }`
            : "(Anonyme)";
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
            }}
        >
            <Typography
                component="h2"
                variant="body1"
                mr={2}
                color="primary"
                sx={{ gridColumn: "1", justifySelf: "end", fontWeight: "700" }}
            >
                {fullName} :
            </Typography>
            <Typography sx={{ gridColumn: "2" }}>{post.content}</Typography>
            {post.imgUrl !== "" && (
                <Container
                    sx={{
                        gridColumn: "1 / 3",
                        padding: 2,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <img src={post.imgUrl} alt="Illustration du post" />
                </Container>
            )}
        </Box>
    );
};

export default ChatPost;
