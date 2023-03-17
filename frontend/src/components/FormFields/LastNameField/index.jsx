import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const LastNameField = ({ lastName, setLastName }) => {
    LastNameField.propTypes = {
        lastName: PropTypes.string,
        setLastName: PropTypes.func,
    };

    const handleChange = (e) => {
        setLastName(e.target.value);
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
        ></TextField>
    );
};

export default LastNameField;
