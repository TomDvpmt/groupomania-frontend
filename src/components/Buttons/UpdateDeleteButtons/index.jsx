import { Box, Button } from "@mui/material";

import PropTypes from "prop-types";

const UpdateDeleteButtons = ({ setShowMessageUpdateForm, setShowAlert }) => {
    UpdateDeleteButtons.propTypes = {
        setShowMessageUpdateForm: PropTypes.func,
        setShowAlert: PropTypes.func,
    };

    const handleUpdate = () => {
        setShowMessageUpdateForm(
            (showMessageUpdateForm) => !showMessageUpdateForm
        );
    };

    const handleDelete = () => {
        setShowAlert(true);
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Button variant="outlined" onClick={handleUpdate} size="small">
                Modifier
            </Button>
            <Button variant="outlined" onClick={handleDelete} size="small">
                Supprimer
            </Button>
        </Box>
    );
};

export default UpdateDeleteButtons;
