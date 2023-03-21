import { useState } from "react";
import AlertDialog from "../../AlertDialog";
import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

const UpdateDeleteButtons = ({
    token,
    messageId,
    imgUrl,
    setHasNewMessages,
    setErrorMessage,
    setShowMessageUpdateForm,
}) => {
    UpdateDeleteButtons.propTypes = {
        token: PropTypes.string,
        messageId: PropTypes.number,
        imgUrl: PropTypes.string,
        setHasNewMessages: PropTypes.func,
        setErrorMessage: PropTypes.func,
        setShowMessageUpdateForm: PropTypes.func,
    };

    const [showAlert, setShowAlert] = useState(false);

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
            {showAlert && (
                <AlertDialog
                    issue="message"
                    issueId={messageId}
                    token={token}
                    imgUrl={imgUrl}
                    setHasNewMessages={setHasNewMessages}
                    setErrorMessage={setErrorMessage}
                    showAlert={showAlert}
                    setShowAlert={setShowAlert}
                />
            )}
        </Box>
    );
};

export default UpdateDeleteButtons;
