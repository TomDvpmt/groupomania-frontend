import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";

const Error404 = () => {
    const token = localStorage.getItem("token");
    const hasToken = !token || token === "null" ? false : true;

    return (
        <Box component="main" padding={1} mt={4} mb={4}>
            <Typography component="h1" variant="h4">
                Page non trouvée.
            </Typography>
            <Typography paragraph>
                La page que vous cherchez n'existe pas.
            </Typography>
            <Link component={RouterLink} to={hasToken ? "/" : "/login"}>
                {hasToken ? "Retour à l'accueil" : "Se connecter"}
            </Link>
        </Box>
    );
};

export default Error404;
