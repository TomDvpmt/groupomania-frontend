import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const PasswordField = ({
    password,
    setPassword,
    passwordError,
    setPasswordError,
    setGlobalErrorMessage,
}) => {
    PasswordField.propTypes = {
        password: PropTypes.string,
        setPassword: PropTypes.func,
        passwordError: PropTypes.string,
        setPasswordError: PropTypes.func,
        setGlobalErrorMessage: PropTypes.func,
    };

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFocus = () => {
        setPasswordError("");
        setGlobalErrorMessage("");
    };

    return (
        <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Mot de passe"
            value={password}
            onChange={handleChange}
            onFocus={handleFocus}
            error={passwordError !== ""}
        />
    );
};

export default PasswordField;
