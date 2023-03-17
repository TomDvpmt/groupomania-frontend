import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const FirstNameField = ({ firstName, setFirstName }) => {
    FirstNameField.propTypes = {
        firstName: PropTypes.string,
        setFirstName: PropTypes.func,
    };

    const handleChange = (e) => {
        setFirstName(e.target.value);
    };

    return (
        <TextField
            autoFocus
            margin="normal"
            fullWidth
            id="firstName"
            name="firstName"
            type="text"
            label="Prénom"
            value={firstName}
            onChange={handleChange}
        ></TextField>
    );
};

export default FirstNameField;
