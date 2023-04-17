import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { setUserState } from "../../utils/utils";

import { Box, Link, Typography } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Error404 = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        setUserState(token, navigate);
    }, [token, navigate]);

    return (
        <Box
            component="main"
            maxWidth={theme.maxWidth.desktop}
            padding={1}
            sx={{ margin: "2rem auto" }}
        >
            <Typography component="h1" variant="h4">
                Page non trouvée.
            </Typography>
            <Typography paragraph>
                La page que vous cherchez n'existe pas.
            </Typography>
            {!token && (
                <Link component={RouterLink} to="/login">
                    Se connecter
                </Link>
            )}
        </Box>
    );
};

export default Error404;
