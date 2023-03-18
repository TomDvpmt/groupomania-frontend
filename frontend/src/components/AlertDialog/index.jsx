import { deletePost, deleteImage, deleteUser } from "../../utils/utils";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

const AlertDialog = ({
    concern,
    concernId,
    token,
    updateContent,
    imgUrl,
    setHasNewMessages,
    setShowUpdateForm,
    setErrorMessage,
    showAlert,
    setShowAlert,
    navigate,
}) => {
    AlertDialog.propTypes = {
        concern: PropTypes.string,
        concernId: PropTypes.number,
        token: PropTypes.string,
        updateContent: PropTypes.string,
        imgUrl: PropTypes.string,
        setHasNewMessages: PropTypes.func,
        setShowUpdateForm: PropTypes.func,
        showAlert: PropTypes.bool,
        setShowAlert: PropTypes.func,
        navigate: PropTypes.func,
    };

    let concernTitle, concernDescription;

    if (concern === "image") {
        concernTitle = "l'image";
        concernDescription = "La suppression de l'image est définitive.";
    } else if (concern === "message") {
        concernTitle = "le message";
        concernDescription = "La suppression du message est définitive.";
    } else if (concern === "user") {
        concernTitle = "le compte";
        concernDescription =
            "Le compte ainsi que tous les messages qui y sont attachés seront supprimés définitivement, sans possibilité de les récupérer.";
    }

    const handleNo = () => {
        setShowAlert(false);
    };

    const handleYes = () => {
        if (concern === "image") {
            deleteImage(
                updateContent,
                imgUrl,
                concernId,
                token,
                setShowUpdateForm,
                setHasNewMessages,
                setErrorMessage
            );
        } else if (concern === "message") {
            deletePost(
                token,
                concernId,
                imgUrl,
                setHasNewMessages,
                setErrorMessage
            );
        } else if (concern === "user") {
            deleteUser(token, concernId, setErrorMessage, navigate);
        }
        setShowAlert(false);
    };

    return (
        <Dialog
            open={showAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Êtes vous sûr de vouloir supprimer {concernTitle} ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {concernDescription}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleNo} autoFocus>
                    Annuler
                </Button>
                <Button onClick={handleYes}>Supprimer {concernTitle}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
