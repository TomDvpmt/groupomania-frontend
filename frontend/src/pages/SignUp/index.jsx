import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fetchCredentials } from "../../utils/utils";
import { Container, Box, Typography, Link } from "@mui/material";
import { theme } from "../../utils/theme";
import FirstNameField from "../../components/FormFields/FirstNameField";
import LastNameField from "../../components/FormFields/LastNameField";
import EmailField from "../../components/FormFields/EmailField";
import PasswordField from "../../components/FormFields/PasswordField";
import PasswordCheckField from "../../components/FormFields/PasswordCheckField";
import SubmitButton from "../../components/Buttons/SubmitButton";
import ErrorMessage from "../../components/ErrorMessage";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
    const [lastName, setLastName] = useState("");
    const [lastNameErrorMessage, setlastNameErrorMessage] = useState("");
    const [email, setEmail] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [globalErrorMessage, setGlobalErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === passwordConfirm) {
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
                            localStorage.setItem("token", token);
                            localStorage.setItem("userId", userId);
                            navigate("/");
                        });
                    }
                })
                .catch((error) => console.log(error));
        } else {
            setGlobalErrorMessage("Les mots de passe ne correspondent pas.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={theme.form}>
                <Typography component="h1" variant="h4" mt={4}>
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
                    }}
                    noValidate
                >
                    <FirstNameField
                        firstName={firstName}
                        setFirstName={setFirstName}
                    />
                    <LastNameField
                        lastName={lastName}
                        setLastName={setLastName}
                    />
                    <EmailField
                        email={email}
                        setEmail={setEmail}
                        emailErrorMessage={emailErrorMessage}
                        setEmailErrorMessage={setEmailErrorMessage}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                        autoFocus={false}
                    />
                    <PasswordField
                        password={password}
                        setPassword={setPassword}
                        passwordErrorMessage={passwordErrorMessage}
                        setPasswordErrorMessage={setPasswordErrorMessage}
                        setGlobalErrorMessage={setGlobalErrorMessage}
                    />
                    <PasswordCheckField
                        passwordConfirm={passwordConfirm}
                        setPasswordConfirm={setPasswordConfirm}
                    />
                    <SubmitButton text="S'enregistrer" />
                    <Link component={RouterLink} to="/login" variant="body2">
                        Déjà un compte ? S'identifier
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
