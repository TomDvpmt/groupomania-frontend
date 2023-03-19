import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    fetchCredentials,
    isValidInput,
    setInputErrorMessages,
    checkInputErrors,
} from "../../utils/utils";
import { Link, Box, Typography, Container } from "@mui/material";
import { theme } from "../../utils/theme";
import SubmitButton from "../../components/Buttons/SubmitButton";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import ErrorMessage from "../../components/ErrorMessage";

const Login = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showFieldErrors, setShowFieldErrors] = useState(false);
    const [globalErrorMessage, setGlobalErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowFieldErrors(true);

        const getInputFields = (fieldNames) => {
            const allInputFields = [
                {
                    name: "email",
                    errors: {
                        isEmpty: {
                            condition: email === "",
                            message: "Adresse e-mail requise.",
                        },
                        isInvalid: {
                            condition: !isValidInput("email", email),
                            message: "Format d'adresse e-mail invalide.",
                        },
                    },
                    errorSetter: setEmailError,
                },
                {
                    name: "password",
                    errors: {
                        isEmpty: {
                            condition: password === "",
                            message: "Mot de passe requis.",
                        },
                        isInvalid: {
                            condition: false,
                            message: " ",
                        },
                    },
                    errorSetter: setPasswordError,
                },
            ];

            const inputFields = allInputFields.filter((field) =>
                fieldNames.includes(field.name)
            );

            return inputFields;
        };

        const inputFields = getInputFields(["email", "password"]);
        const hasErrors = checkInputErrors(inputFields);
        hasErrors && setInputErrorMessages(inputFields);

        if (hasErrors) {
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
                        response.json().then(({ token, userId }) => {
                            localStorage.setItem("token", token);
                            localStorage.setItem("userId", userId);
                            navigate("/");
                        });
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
                        autoFocus={true}
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
