import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileData from "../../components/ProfileData";
import UserUpdateForm from "../../components/Forms/UserUpdateForm";
import AlertDialog from "../../components/AlertDialog";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

import {
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
} from "../../services/utils/selectors";

import { setUserState } from "../../utils/utils";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Profile = () => {
    const { userId } = useParams();

    const firstName = useSelector(selectUserFirstName());
    const lastName = useSelector(selectUserLastName());
    const email = useSelector(selectUserEmail());

    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState("");
    const [modifiable, setModifiable] = useState(false);
    const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);
    const [showValidationMessage, setShowValidationMessage] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        setUserState(token, navigate);
    }, [token, navigate]);

    const handleUpdate = () => {
        setShowUserUpdateForm((showUserUpdateForm) => !showUserUpdateForm);
        setShowValidationMessage(false);
    };

    const handleDelete = () => {
        setShowAlert(true);
    };

    useEffect(() => {
        setErrorMessage("");
    }, [showUserUpdateForm]);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401 || response.status === 404) {
                    navigate("/");
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                // setFirstName(data.firstName);
                // setLastName(data.lastName);
                // setEmail(data.email);
                setModifiable(data.modifiable);
            })
            .catch((error) => {
                console.log(
                    // "Impossible d'afficher les données de l'utilisateur :",
                    error
                );
                // setErrorMessage("Impossible d'afficher les données.");
            })
            .finally(setLoading(false));
    }, [token, userId, navigate]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Box
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                    maxWidth={theme.maxWidth.desktop}
                    mb={4}
                    ml="auto"
                    mr="auto"
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        textAlign="center"
                        mt={4}
                        mb={4}
                    >
                        {firstName + " " + lastName}
                    </Typography>
                    <Container sx={{ padding: 0, maxWidth: "500px" }}>
                        {showValidationMessage && (
                            <Typography
                                color={theme.palette.validation.main}
                                mb={2}
                            >
                                Les informations ont été mises à jour.
                            </Typography>
                        )}
                        <ProfileData
                            firstName={firstName}
                            lastName={lastName}
                            email={email}
                        />
                    </Container>
                    {modifiable && (
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mt: 4, pl: 2, pr: 2 }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleUpdate}
                            >
                                Modifier les informations
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ textTransform: "initial" }}
                                onClick={handleDelete}
                            >
                                Supprimer le compte
                            </Button>
                        </Stack>
                    )}
                    {showUserUpdateForm && (
                        <UserUpdateForm
                            token={token}
                            userId={parseInt(userId)}
                            // prevFirstName={firstName}
                            // prevLastName={lastName}
                            // prevEmail={email}
                            // setFirstName={setFirstName}
                            // setLastName={setLastName}
                            // setEmail={setEmail}
                            setErrorMessage={setErrorMessage}
                            setShowUserUpdateForm={setShowUserUpdateForm}
                            setShowValidationMessage={setShowValidationMessage}
                        />
                    )}
                    {showAlert && (
                        <AlertDialog
                            issue="user"
                            issueId={parseInt(userId)}
                            token={token}
                            setErrorMessage={setErrorMessage}
                            showAlert={showAlert}
                            setShowAlert={setShowAlert}
                            navigate={navigate}
                        />
                    )}
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} />
                    )}
                </Box>
            )}
        </>
    );
};

export default Profile;
