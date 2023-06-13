import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import SubmitButton from "../../components/Buttons/SubmitButton";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import ErrorMessage from "../../components/ErrorMessage";

import { userSetIsLoggedIn, userSetInfo } from "../../services/features/user";
import { pageUpdateLocation } from "../../services/features/page";

import { fetchCredentials } from "../../utils/requests";
import {
    getInputFields,
    setInputErrorMessages,
    checkInputErrors,
} from "../../utils/formValidation";

import { Link, Box, Typography, Container, Button } from "@mui/material";
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

    useEffect(() => {
        dispatch(pageUpdateLocation("login"));
    }, [dispatch]);

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

        if (e.target.id !== "demo1" && e.target.id !== "demo2") {
            hasErrors && setInputErrorMessages(inputFields);

            if (hasErrors || password === "") {
                return;
            }
        }
        let loginData = {
            email: email,
            password: password,
        };

        if (e.target.id === "demo1") {
            loginData = {
                email: "demo_user@gmail.com",
                password: "password",
            };
        }
        if (e.target.id === "demo2") {
            loginData = {
                email: "demo2_user@gmail.com",
                password: "password",
            };
        }

        fetchCredentials("login", loginData)
            .then((response) => {
                if (response.status >= 400) {
                    response.json().then(({ message }) => {
                        setGlobalErrorMessage(message);
                    });
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
                                const userData = {
                                    id: userId,
                                    admin,
                                    firstName,
                                    lastName,
                                    email,
                                };
                                dispatch(userSetIsLoggedIn());
                                dispatch(userSetInfo(userData));

                                sessionStorage.setItem("token", token);
                                navigate("/");
                            }
                        );
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box pb="4rem" sx={theme.form}>
                <Typography variant="h4" component="h1" mt={4}>
                    Connexion
                </Typography>
                <Box
                    m="4rem 0 3rem"
                    display="flex"
                    justifyContent="center"
                    gap="1rem"
                >
                    <Button
                        id="demo1"
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                    >
                        Utilisateur démo 1
                    </Button>
                    <Button
                        id="demo2"
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                    >
                        Utilisateur démo 2
                    </Button>
                </Box>
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
                    <Box display="flex" justifyContent="flex-end">
                        <Link
                            component={RouterLink}
                            to="/signup"
                            variant="body2"
                        >
                            Créer un compte
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
