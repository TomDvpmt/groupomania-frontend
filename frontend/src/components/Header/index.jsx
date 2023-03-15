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
        <Box component="header" bgcolor="white">
            <Box sx={{ maxWidth: "300px", margin: "auto" }}>
                <img src={logo} alt="Groupomania logo" />
            </Box>
            {nav && (
                <Toolbar
                    component="nav"
                    sx={{
                        bgcolor: myTheme.palette.secondary.main,
                        justifyContent: "center",
                    }}
                >
                    <Box flexGrow="1" maxWidth={myTheme.maxWidth.desktop}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            onClick={handleClick}
                            sx={{ paddingLeft: 2 }}
                        >
                            Déconnexion
                        </Button>
                    </Box>
                </Toolbar>
            )}
        </Box>
    );
};

export default Header;
