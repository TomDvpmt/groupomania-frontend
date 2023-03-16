import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const PasswordCheckField = ({ passwordConfirm, setPasswordConfirm }) => {
    PasswordCheckField.propTypes = {
        passwordConfirm: PropTypes.string,
        setPasswordConfirm: PropTypes.func,
    };

    const handleChange = (e) => {
        setPasswordConfirm(e.target.value);
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
        />
    );
};

export default PasswordCheckField;
