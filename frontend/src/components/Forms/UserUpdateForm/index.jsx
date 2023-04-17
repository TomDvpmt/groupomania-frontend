import { useState } from "react";
import { useSelector } from "react-redux";

import FirstNameField from "../../FormFields/FirstNameField";
import LastNameField from "../../FormFields/LastNameField";
import EmailField from "../../FormFields/EmailField";

import store from "../../../services/utils/store";
import {
    userSetFirstName,
    userSetLastName,
    userSetEmail,
} from "../../../services/features/user";
import {
    selectUserId,
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
} from "../../../services/utils/selectors";

import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

const UserUpdateForm = ({
    setErrorMessage,
    setShowUserUpdateForm,
    setShowValidationMessage,
}) => {
    UserUpdateForm.propTypes = {
        setErrorMessage: PropTypes.func,
        setShowUserUpdateForm: PropTypes.func,
        setShowValidationMessage: PropTypes.func,
    };

    const token = sessionStorage.getItem("token");

    const userId = useSelector(selectUserId());
    const prevFirstName = useSelector(selectUserFirstName());
    const prevLastName = useSelector(selectUserLastName());
    const prevEmail = useSelector(selectUserEmail());

    const [newFirstName, setNewFirstName] = useState(prevFirstName);
    const [newLastName, setNewLastName] = useState(prevLastName);
    const [newEmail, setNewEmail] = useState(prevEmail);
    const [newFirstNameError, setNewFirstNameError] = useState("");
    const [newLastNameError, setNewLastNameError] = useState("");
    const [newEmailError, setNewEmailError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            newFirstName === prevFirstName &&
            newLastName === prevLastName &&
            newEmail === prevEmail
        ) {
            setShowUserUpdateForm(false);
        } else {
            const userData = {
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
            };
            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `BEARER ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (response.status < 400) {
                        setShowValidationMessage(true);
                        setShowUserUpdateForm(false);
                        return response.json();
                    } else {
                        setErrorMessage("Impossible de modifier les données.");
                    }
                })
                .then(() => {
                    store.dispatch(userSetFirstName(newFirstName));
                    store.dispatch(userSetLastName(newLastName));
                    store.dispatch(userSetEmail(newEmail));
                })
                .catch((error) => {
                    setErrorMessage("Impossible de modifier les données.");
                    setShowUserUpdateForm(false);
                    console.log("Impossible de modifier les données :", error);
                });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mt={2} mb={6}>
            <FirstNameField
                firstName={newFirstName}
                setFirstName={setNewFirstName}
                firstNameError={newFirstNameError}
                setFirstNameError={setNewFirstNameError}
                setGlobalErrorMessage={setErrorMessage}
                hasAutoFocus={true}
            />
            <LastNameField
                lastName={newLastName}
                setLastName={setNewLastName}
                lastNameError={newLastNameError}
                setLastNameError={setNewLastNameError}
                setGlobalErrorMessage={setErrorMessage}
            />
            <EmailField
                email={newEmail}
                setEmail={setNewEmail}
                emailError={newEmailError}
                setEmailError={setNewEmailError}
                setGlobalErrorMessage={setErrorMessage}
                hasAutoFocus={false}
            />
            <Button type="submit" variant="contained">
                Valider
            </Button>
        </Box>
    );
};

export default UserUpdateForm;
