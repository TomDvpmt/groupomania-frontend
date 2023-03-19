import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const EmailField = ({
    email,
    setEmail,
    emailError,
    setEmailError,
    setGlobalErrorMessage,
    autoFocus,
}) => {
    EmailField.propTypes = {
        email: PropTypes.string,
        setEmail: PropTypes.func,
        emailError: PropTypes.string,
        setEmailError: PropTypes.func,
        setGlobalErrorMessage: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFocus = () => {
        setEmailError("");
        setGlobalErrorMessage("");
    };

    return (
        <TextField
            autoFocus={autoFocus}
            required
            margin="normal"
            fullWidth
            id="email"
            name="email"
            type="email"
            label="Adresse e-mail"
            value={email}
            onChange={handleChange}
            onFocus={handleFocus}
            error={emailError !== ""}
        />
    );
};

export default EmailField;
