import logo from "../../assets/brand/icon-left-font-cropped.png";
import { Link } from "react-router-dom";

import { Box, Toolbar, Button, Typography } from "@mui/material";
import { theme } from "../../utils/theme";

import PropTypes from "prop-types";

const Header = ({ hasToken }) => {
    Header.propTypes = {
        hasToken: PropTypes.bool,
    };

    const handleLogOut = () => {
        localStorage.setItem("token", null);
    };

    return (
        <Box component="header" bgcolor="white">
            <Box
                sx={{
                    maxWidth: "300px",
                    margin: "auto",
                    padding: "4rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="Groupomania logo"
                    sx={{
                        maxWidth: "300px",
                    }}
                />
                {hasToken && (
                    <>
                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{
                                fontSize: "2rem",
                                fontWeight: "500",
                                textTransform: "uppercase",
                                color: theme.palette.primary.main,
                            }}
                        >
                            Intranet
                        </Typography>
                        <Typography variant="h6" textAlign="center">
                            Restez en communication avec vos collègues
                        </Typography>
                    </>
                )}
            </Box>
            {hasToken && (
                <Toolbar
                    component="nav"
                    sx={{
                        bgcolor: theme.palette.secondary.main,
                        justifyContent: "center",
                    }}
                >
                    <Box flexGrow="1" maxWidth={theme.maxWidth.desktop}>
                        <Button
                            component={Link}
                            to="/login"
                            onClick={handleLogOut}
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
