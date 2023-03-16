import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const PasswordField = ({ password, setPassword }) => {
    PasswordField.propTypes = {
        password: PropTypes.string,
        setPassword: PropTypes.func,
    };

    const handleChange = (e) => {
        setPassword(e.target.value);
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
        />
    );
};

export default PasswordField;
