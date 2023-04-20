import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { postUpdate, postCommentUpdate } from "../../services/features/posts";

import { deleteMessage, deleteUser } from "../../utils/requests";

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
    issue,
    issueId,
    parentId,
    updateContent,
    imgUrl,
    setHasNewMessages,
    setShowUpdateForm,
    setErrorMessage,
    showAlert,
    setShowAlert,
}) => {
    AlertDialog.propTypes = {
        issue: PropTypes.string,
        issueId: PropTypes.number,
        parentId: PropTypes.number,
        updateContent: PropTypes.string,
        imgUrl: PropTypes.string,
        setHasNewMessages: PropTypes.func,
        setShowUpdateForm: PropTypes.func,
        showAlert: PropTypes.bool,
        setShowAlert: PropTypes.func,
    };

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let issueTitle, issueDescription;

    if (issue === "image") {
        issueTitle = "l'image";
        issueDescription = "La suppression de l'image est définitive.";
    } else if (issue === "post" || issue === "comment") {
        issueTitle = "le message";
        issueDescription = "La suppression du message est définitive.";
    } else if (issue === "user") {
        issueTitle = "le compte";
        issueDescription =
            "Le compte ainsi que tous les messages qui y sont attachés seront supprimés définitivement, sans possibilité de les récupérer.";
    }

    const handleNo = () => {
        setShowAlert(false);
    };

    const handleYes = () => {
        if (issue === "image") {
            const messageType = parentId === 0 ? "post" : "comment";
            console.log(messageType);
            const content = updateContent;
            const formData = new FormData();

            formData.append("content", content);
            formData.append("imgUrl", imgUrl);
            formData.append("deleteImg", true);

            fetch(`/API/${messageType}s/${issueId}`, {
                method: "PUT",
                headers: {
                    Authorization: `BEARER ${token}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (response.status >= 400) {
                        response
                            .json()
                            .then(({ message }) => setErrorMessage(message));
                    } else {
                        setShowUpdateForm(false);
                        dispatch(
                            messageType === "post"
                                ? postUpdate({
                                      parentId: 0,
                                      messageId: issueId,
                                      type: "imgUrl",
                                      content: "",
                                  })
                                : postCommentUpdate({
                                      parentId,
                                      messageId: issueId,
                                      type: "imgUrl",
                                      content: "",
                                  })
                        );
                        setHasNewMessages(
                            (hasNewMessages) => hasNewMessages + 1
                        );
                    }
                })
                .catch((error) => {
                    setErrorMessage("Impossible de modifier le message.");
                    console.error(
                        "Impossible de modifier le message : ",
                        error
                    );
                });
        } else if (issue === "post" || issue === "comment") {
            deleteMessage(
                token,
                issue,
                issueId,
                parentId,
                imgUrl,
                setHasNewMessages,
                setErrorMessage
            );
        } else if (issue === "user") {
            deleteUser(token, issueId, setErrorMessage, navigate);
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
                Êtes vous sûr de vouloir supprimer {issueTitle} ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {issueDescription}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleNo} autoFocus>
                    Annuler
                </Button>
                <Button onClick={handleYes}>Supprimer {issueTitle}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
