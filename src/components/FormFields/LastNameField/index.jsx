import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const LastNameField = ({
    lastName,
    setLastName,
    lastNameError,
    setLastNameError,
    setGlobalErrorMessage,
}) => {
    LastNameField.propTypes = {
        lastName: PropTypes.string,
        setLastName: PropTypes.func,
        lastNameError: PropTypes.string,
        setLastNameError: PropTypes.func,
        setGlobalErrorMessage: PropTypes.func,
    };

    const handleChange = (e) => {
        setLastName(e.target.value);
    };

    const handleFocus = () => {
        setLastNameError("");
        setGlobalErrorMessage("");
    };

    return (
        <TextField
            margin="normal"
            fullWidth
            id="LastName"
            name="LastName"
            type="text"
            label="Nom"
            value={lastName}
            onChange={handleChange}
            onFocus={handleFocus}
            error={lastNameError !== ""}
        ></TextField>
    );
};

export default LastNameField;
