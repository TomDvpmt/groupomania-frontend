import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserUpdateForm from "../../components/Forms/UserUpdateForm";
import AlertDialog from "../../components/AlertDialog";
import ErrorMessage from "../../components/ErrorMessage";
import { Box, Container, Typography, Button, Stack } from "@mui/material";

const Profile = () => {
    const token = localStorage.getItem("token");
    const { userId } = useParams();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [modifiable, setModifiable] = useState(false);
    const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);
    const [showValidationMessage, setShowValidationMessage] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

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
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    navigate("/");
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setModifiable(data.modifiable);
            })
            .catch((error) => {
                console.log(
                    "Impossible d'afficher les données de l'utilisateur :",
                    error
                );
                setErrorMessage("Impossible d'afficher les données.");
            });
    }, [token, userId]);

    return (
        <Box
            component="main"
            sx={{
                mb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography
                component="h1"
                variant="h4"
                textAlign="center"
                mt={4}
                mb={2}
            >
                Profil
            </Typography>
            <Container>
                {showValidationMessage && (
                    <Typography color="green" mb={2}>
                        Les données ont été mises à jour.
                    </Typography>
                )}
                <Typography>Prénom : {firstName}</Typography>
                <Typography>Nom : {lastName}</Typography>
                <Typography>Adresse e-mail : {email}</Typography>
            </Container>
            {modifiable && (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
                    prevFirstName={firstName}
                    prevLastName={lastName}
                    prevEmail={email}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setEmail={setEmail}
                    setErrorMessage={setErrorMessage}
                    setShowUserUpdateForm={setShowUserUpdateForm}
                    setShowValidationMessage={setShowValidationMessage}
                />
            )}
            {showAlert && (
                <AlertDialog
                    concern="user"
                    concernId={parseInt(userId)}
                    token={token}
                    setErrorMessage={setErrorMessage}
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                    navigate={navigate}
                />
            )}
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </Box>
    );
};

export default Profile;
