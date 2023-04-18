import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import SubmitButton from "../../components/Buttons/SubmitButton";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import ErrorMessage from "../../components/ErrorMessage";

import { userSetIsLoggedIn, userSetInfo } from "../../services/features/user";

import { fetchCredentials } from "../../utils/requests";
import {
    getInputFields,
    setInputErrorMessages,
    checkInputErrors,
} from "../../utils/formValidation";

import { Link, Box, Typography, Container } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Login = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showFieldErrors, setShowFieldErrors] = useState(false);
    const [globalErrorMessage, setGlobalErrorMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowFieldErrors(true);

        const inputFields = getInputFields([
            [
                "email",
                email,
                "Adresse e-mail requise.",
                "Format d'adresse e-mail invalide",
                setEmailError,
            ],
        ]);

        password === "" && setPasswordError("Mot de passe requis.");

        const hasErrors = checkInputErrors(inputFields);
        hasErrors && setInputErrorMessages(inputFields);

        if (hasErrors || password === "") {
            return;
        } else {
            const loginData = {
                email: email,
                password: password,
            };

            fetchCredentials("login", loginData)
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) =>
                                setGlobalErrorMessage(message)
                            );
                    } else {
                        response
                            .json()
                            .then(
                                ({
                                    token,
                                    userId,
                                    admin,
                                    firstName,
                                    lastName,
                                    email,
                                }) => {
                                    dispatch(userSetIsLoggedIn());
                                    dispatch(
                                        userSetInfo({
                                            id: userId,
                                            admin,
                                            firstName,
                                            lastName,
                                            email,
                                        })
                                    );
                                    sessionStorage.setItem("token", token);
                                    navigate("/");
                                }
                            );
                    }
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={theme.form}>
                <Typography variant="h4" component="h1" mt={4}>
                    Connexion
                </Typography>
                <Box
                    component="form"
                    noValidate
                    mt={2}
                    onSubmit={handleSubmit}
                    width="100%"
                >
                    {globalErrorMessage && (
                        <ErrorMessage errorMessage={globalErrorMessage} />
                    )}
                    <EmailField
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                        hasAutoFocus={true}
                    />
                    {showFieldErrors && (
                        <Typography color="red">{emailError}</Typography>
                    )}
                    <PasswordField
                        password={password}
                        setPassword={setPassword}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                    />
                    {showFieldErrors && (
                        <Typography color="red">{passwordError}</Typography>
                    )}
                    <SubmitButton text="Se connecter" />
                    <Link component={RouterLink} to="/signup" variant="body2">
                        Créer un compte
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
