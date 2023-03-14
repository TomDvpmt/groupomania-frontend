import logo from "../../assets/brand/icon-left-font.svg";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "@mui/material";

import { Box, Toolbar, Button } from "@mui/material";
import { myTheme } from "../../utils/theme";

const Header = ({ nav }) => {
    const handleClick = () => {
        localStorage.setItem("token", null);
    };

    return (
        <Box component="header">
            <Container
                component="img"
                sx={{ width: "50%" }}
                src={logo}
                alt="Groupomania logo"
            />
            {nav && (
                <Toolbar
                    component="nav"
                    sx={{
                        bgcolor: myTheme.palette.secondary.main,
                    }}
                >
                    <Button
                        component={RouterLink}
                        to="/login"
                        onClick={handleClick}
                    >
                        Déconnexion
                    </Button>
                </Toolbar>
            )}
        </Box>
    );
};

export default Header;
