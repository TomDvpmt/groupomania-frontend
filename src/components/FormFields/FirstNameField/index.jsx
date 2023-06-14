import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const FirstNameField = ({
    firstName,
    setFirstName,
    firstNameError,
    setFirstNameError,
    setGlobalErrorMessage,
    hasAutoFocus,
}) => {
    FirstNameField.propTypes = {
        firstName: PropTypes.string,
        setFirstName: PropTypes.func,
        firstNameError: PropTypes.string,
        setFirstNameError: PropTypes.func,
        setGlobalErrorMessage: PropTypes.func,
        hasAutoFocus: PropTypes.bool,
    };

    const handleChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleFocus = () => {
        setFirstNameError("");
        setGlobalErrorMessage("");
    };

    return (
        <TextField
            autoFocus={hasAutoFocus}
            margin="normal"
            fullWidth
            id="firstName"
            name="firstName"
            type="text"
            label="Prénom"
            value={firstName}
            onChange={handleChange}
            onFocus={handleFocus}
            error={firstNameError !== ""}
        ></TextField>
    );
};

export default FirstNameField;
