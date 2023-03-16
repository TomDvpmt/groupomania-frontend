import logo from "../../assets/brand/icon-left-font.svg";
import { Link } from "react-router-dom";

import { Box, Toolbar, Button } from "@mui/material";
import { myTheme } from "../../utils/theme";

import PropTypes from "prop-types";

const Header = ({ nav }) => {
    Header.propTypes = {
        nav: PropTypes.bool,
    };

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
                            component={Link}
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
