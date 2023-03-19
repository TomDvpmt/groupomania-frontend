import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography } from "@mui/material";
import { theme } from "../../utils/theme";

const Error404 = () => {
    const token = localStorage.getItem("token");
    const hasToken = !token || token === "null" ? false : true;

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
            <Link component={RouterLink} to={hasToken ? "/" : "/login"}>
                {hasToken ? "Retour à l'accueil" : "Se connecter"}
            </Link>
        </Box>
    );
};

export default Error404;
