import { deletePost, deleteImage } from "../../utils/utils";
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
    token,
    postId,
    updateContent,
    imgUrl,
    setHasNewMessages,
    setShowUpdateForm,
    setErrorMessage,
    showAlert,
    setShowAlert,
}) => {
    AlertDialog.propTypes = {
        concern: PropTypes.string,
        token: PropTypes.string,
        postId: PropTypes.number,
        updateContent: PropTypes.string,
        imgUrl: PropTypes.string,
        setHasNewMessages: PropTypes.func,
        setShowUpdateForm: PropTypes.func,
        showAlert: PropTypes.bool,
        setShowAlert: PropTypes.func,
    };

    const concernTitle = concern === "image" ? "l'image" : "le message";
    const concernDescription =
        concern === "image"
            ? `La suppression de l'image est définitive.`
            : `La suppression du message est définitive.`;

    const handleNo = () => {
        setShowAlert(false);
    };

    const handleYes = () => {
        concern === "image"
            ? deleteImage(
                  updateContent,
                  imgUrl,
                  postId,
                  token,
                  setShowUpdateForm,
                  setHasNewMessages,
                  setErrorMessage
              )
            : deletePost(
                  token,
                  postId,
                  imgUrl,
                  setHasNewMessages,
                  setErrorMessage
              );
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
                    Non
                </Button>
                <Button onClick={handleYes}>Oui</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
