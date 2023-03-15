import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils/utils";
import { TextField, Link, Box, Typography, Container } from "@mui/material";
import { myTheme } from "../../utils/theme";
import SubmitButton from "../../components/Buttons/SubmitButton";
import ErrorMessage from "../../components/ErrorMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const loginData = {
            email: email,
            password: password,
        };

        fetchCredentials("login", loginData)
            .then((response) => {
                if (response.status >= 400) {
                    response
                        .json()
                        .then(({ message }) => setErrorMessage(message));
                } else {
                    response.json().then(({ token }) => {
                        localStorage.setItem("token", token);
                        navigate("/");
                    });
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={myTheme.form}>
                <Typography variant="h4" component="h1">
                    Connexion
                </Typography>
                <Box
                    component="form"
                    noValidate
                    sx={{ mt: 2 }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        label="Adresse e-mail"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        name="password"
                        type="password"
                        label="Mot de passe"
                        value={password}
                        onChange={handleChange}
                    />
                    <SubmitButton text="Se connecter" />
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} />
                    )}
                    <Link component={RouterLink} to="/signup" variant="body2">
                        Créer un compte
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
