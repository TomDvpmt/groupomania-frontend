import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const EmailField = ({ email, setEmail }) => {
    EmailField.propTypes = {
        email: PropTypes.string,
        setEmail: PropTypes.func,
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <TextField
            margin="normal"
            required
            fullWidth
            autoFocus
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
