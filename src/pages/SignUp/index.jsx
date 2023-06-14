import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import FirstNameField from "../../components/FormFields/FirstNameField";
import LastNameField from "../../components/FormFields/LastNameField";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import PasswordConfirmField from "../../components/FormFields/PasswordConfirmField";
import SubmitButton from "../../components/Buttons/SubmitButton";
import ErrorMessage from "../../components/ErrorMessage";

import { fetchCredentials } from "../../utils/requests";
import {
    getInputFields,
    checkInputErrors,
    setInputErrorMessages,
} from "../../utils/formValidation";

import { Container, Box, Typography, Link } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState("");
    const [showFieldErrors, setShowFieldErrors] = useState(false);
    const [globalErrorMessage, setGlobalErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowFieldErrors(true);

        const inputFields = getInputFields([
            [
                "firstName",
                firstName,
                "",
                "Le prénom ne peut inclure que des lettres, espaces et apostrophes.",
                setFirstNameError,
            ],
            [
                "lastName",
                lastName,
                "",
                "Le nom ne peut inclure que des lettres, espaces et apostrophes.",
                setLastNameError,
            ],
            [
                "email",
                email,
                "Adresse e-mail requise.",
                "Format d'adresse e-mail invalide",
                setEmailError,
            ],
            [
                "password",
                password,
                "Mot de passe requis.",
                "Le mot de passe doit comporter au moins 4 caractères.",
                setPasswordError,
            ],
        ]);

        const hasErrors = checkInputErrors(inputFields);
        hasErrors && setInputErrorMessages(inputFields);

        password !== passwordConfirm &&
            setPasswordConfirmError("Les mots de passe ne correspondent pas.");

        if (password !== passwordConfirm || hasErrors) {
            return;
        } else {
            const signUpData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            };

            fetchCredentials("signup", signUpData)
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) =>
                                setGlobalErrorMessage(message)
                            );
                    } else {
                        response.json().then(({ token, userId }) => {
                            sessionStorage.setItem("token", token);
                            sessionStorage.setItem("userId", userId);
                            sessionStorage.setItem("firstName", firstName);
                            sessionStorage.setItem("lastName", lastName);
                            navigate("/");
                        });
                    }
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box pb="4rem" sx={theme.form}>
                <Typography component="h1" variant="h4" mt={4} mb={2}>
                    Créer un compte
                </Typography>
                {globalErrorMessage && (
                    <ErrorMessage errorMessage={globalErrorMessage} />
                )}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        mt: 2,
                        width: "100%",
                    }}
                    noValidate
                >
                    <FirstNameField
                        firstName={firstName}
                        setFirstName={setFirstName}
                        firstNameError={firstNameError}
                        setFirstNameError={setFirstNameError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                        hasAutoFocus={true}
                    />
                    {showFieldErrors && (
                        <Typography color="red">{firstNameError}</Typography>
                    )}
                    <LastNameField
                        lastName={lastName}
                        setLastName={setLastName}
                        lastNameError={lastNameError}
                        setLastNameError={setLastNameError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                    />
                    {showFieldErrors && (
                        <Typography color="red">{lastNameError}</Typography>
                    )}
                    <EmailField
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                        hasAutoFocus={false}
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
                    <PasswordConfirmField
                        passwordConfirm={passwordConfirm}
                        setPasswordConfirm={setPasswordConfirm}
                        passwordConfirmError={passwordConfirmError}
                        setPasswordConfirmError={setPasswordConfirmError}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                    />
                    {showFieldErrors && (
                        <Typography color="red">
                            {passwordConfirmError}
                        </Typography>
                    )}
                    <SubmitButton text="S'enregistrer" />
                    <Box display="flex" justifyContent="flex-end">
                        <Link
                            component={RouterLink}
                            to="/login"
                            variant="body2"
                        >
                            Déjà un compte ? S'identifier
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
