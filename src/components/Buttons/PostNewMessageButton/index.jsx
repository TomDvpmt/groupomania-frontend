import { Button } from "@mui/material";
import PropTypes from "prop-types";

const PostNewMessageButton = ({ showNewPostForm, setShowNewPostForm }) => {
    PostNewMessageButton.propTypes = {
        showNewPostForm: PropTypes.bool,
        setShowNewPostForm: PropTypes.func,
    };

    const handleClick = () => {
        setShowNewPostForm((showNewPostForm) => !showNewPostForm);
    };

    return (
        <Button
            variant={showNewPostForm ? "outlined" : "contained"}
            size="large"
            onClick={handleClick}
            sx={{ maxWidth: "250px", alignSelf: "center", fontWeight: "700" }}
        >
            Publier un message
        </Button>
    );
};

export default PostNewMessageButton;
