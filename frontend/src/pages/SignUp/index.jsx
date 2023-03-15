import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils/utils";

import { Container, Box, TextField, Typography, Link } from "@mui/material";
import { myTheme } from "../../utils/theme";
import SubmitButton from "../../components/Buttons/SubmitButton";
import ErrorMessage from "../../components/ErrorMessage";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        if (e.target.name === "passwordConfirm") {
            setPasswordConfirm(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === passwordConfirm) {
            const signUpData = {
                email: email,
                password: password,
            };

            fetchCredentials("signup", signUpData)
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
        } else {
            setErrorMessage("Les mots de passe ne correspondent pas.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={myTheme.form}>
                <Typography component="h1" variant="h4">
                    Créer un compte
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        mt: 2,
                    }}
                    noValidate
                >
                    <TextField
                        type="email"
                        name="email"
                        label="Votre adresse e-mail"
                        value={email}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        autoFocus
                    />
                    <TextField
                        type="password"
                        name="password"
                        label="Votre mot de passe"
                        value={password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        type="password"
                        name="passwordConfirm"
                        label="Confirmez votre mot de passe"
                        value={passwordConfirm}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <SubmitButton text="S'enregistrer" />
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} />
                    )}
                    <Link component={RouterLink} to="/login" variant="body2">
                        Déjà un compte ? S'identifier
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
