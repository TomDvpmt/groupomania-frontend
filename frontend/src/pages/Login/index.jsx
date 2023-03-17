import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils/utils";
import { Link, Box, Typography, Container } from "@mui/material";
import { theme } from "../../utils/theme";
import SubmitButton from "../../components/Buttons/SubmitButton";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import ErrorMessage from "../../components/ErrorMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

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
            <Box sx={theme.form}>
                <Typography variant="h4" component="h1" mt={4}>
                    Connexion
                </Typography>
                <Box component="form" noValidate mt={2} onSubmit={handleSubmit}>
                    <EmailField
                        email={email}
                        setEmail={setEmail}
                        autoFocus={true}
                    />
                    <PasswordField
                        password={password}
                        setPassword={setPassword}
                    />
                    <SubmitButton text="Se connecter" />
                    <Link component={RouterLink} to="/signup" variant="body2">
                        Créer un compte
                    </Link>
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} />
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
