import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const EmailField = ({ email, setEmail, autoFocus }) => {
    EmailField.propTypes = {
        email: PropTypes.string,
        setEmail: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
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
        />
    );
};

export default EmailField;
