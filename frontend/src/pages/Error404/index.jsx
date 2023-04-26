import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import { pageUpdateLocation } from "../../services/features/page";

import { Box, Link, Typography } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Error404 = () => {
    const token = sessionStorage.getItem("token");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(pageUpdateLocation("error404"));
    }, [dispatch]);

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
            {token ? (
                <Link component={RouterLink} to="/">
                    Retour à l'accueil
                </Link>
            ) : (
                <Link component={RouterLink} to="/login">
                    Se connecter
                </Link>
            )}
        </Box>
    );
};

export default Error404;
