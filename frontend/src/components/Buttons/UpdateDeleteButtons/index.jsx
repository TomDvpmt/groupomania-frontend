import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import { deletePost } from "../../../utils/utils";

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

    const handleUpdate = () => {
        setShowMessageUpdateForm(
            (showMessageUpdateForm) => !showMessageUpdateForm
        );
    };

    const handleDelete = () => {
        deletePost(
            token,
            messageId,
            imgUrl,
            setHasNewMessages,
            setErrorMessage
        );
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
