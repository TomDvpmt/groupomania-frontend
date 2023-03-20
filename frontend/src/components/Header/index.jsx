import logo from "../../assets/brand/icon-left-font-cropped.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Toolbar,
    Button,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    IconButton,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { theme } from "../../utils/theme";
import PropTypes from "prop-types";

const Header = ({ isLogged, page }) => {
    Header.propTypes = {
        isLogged: PropTypes.bool,
        page: PropTypes.string,
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const loggedUserId = localStorage.getItem("userId");

    const handleAvatarClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        setAnchorEl(null);
        navigate(`/users/${loggedUserId}`);
    };

    const handleLogOut = () => {
        localStorage.clear();
        navigate("/login");
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

                <>
                    <Typography
                        component={page === "home" ? "h1" : "p"}
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
                    <Typography component="p" variant="h6" textAlign="center">
                        Restez en communication avec vos collègues
                    </Typography>
                </>
            </Box>

            {isLogged && (
                <Toolbar
                    component="nav"
                    sx={{
                        bgcolor: theme.palette.secondary.main,
                        justifyContent: "center",
                    }}
                >
                    <Box
                        flexGrow="1"
                        maxWidth={theme.maxWidth.desktop}
                        sx={{
                            display: "flex",
                            justifyContent:
                                page === "home" ? "end" : "space-between",
                        }}
                    >
                        {page !== "home" && (
                            <Button component={Link} to="/">
                                Retour
                            </Button>
                        )}
                        <IconButton onClick={handleAvatarClick} size="small">
                            <Avatar />
                        </IconButton>
                        <Menu
                            open={open}
                            onClose={handleClose}
                            anchorEl={anchorEl}
                            transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                            }}
                            anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                            }}
                        >
                            <MenuItem
                                onClick={handleProfileClick}
                                sx={{ display: "flex", gap: 1 }}
                            >
                                <Avatar fontSize="small" />
                                Mon profil
                            </MenuItem>
                            <MenuItem
                                onClick={handleLogOut}
                                sx={{ display: "flex", gap: 1 }}
                            >
                                <Logout />
                                Déconnexion
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            )}
        </Box>
    );
};

export default Header;
