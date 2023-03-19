import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const PasswordCheckField = ({
    passwordConfirm,
    setPasswordConfirm,
    passwordConfirmError,
    setPasswordConfirmError,
    setGlobalErrorMessage,
}) => {
    PasswordCheckField.propTypes = {
        passwordConfirm: PropTypes.string,
        setPasswordConfirm: PropTypes.func,
        passwordConfirmError: PropTypes.string,
        setPasswordConfirmError: PropTypes.func,
        setGlobalErrorMessage: PropTypes.func,
    };

    const handleChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const handleFocus = () => {
        setPasswordConfirmError("");
        setGlobalErrorMessage("");
    };

    return (
        <TextField
            fullWidth
            margin="normal"
            required
            type="password"
            name="passwordConfirm"
            label="Confirmez votre mot de passe"
            value={passwordConfirm}
            onChange={handleChange}
            onFocus={handleFocus}
            error={passwordConfirmError !== ""}
        />
    );
};

export default PasswordCheckField;
