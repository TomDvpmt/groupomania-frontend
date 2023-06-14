import { Button } from "@mui/material";
import PropTypes from "prop-types";

const SubmitButton = ({ text }) => {
    SubmitButton.propTypes = {
        text: PropTypes.string,
    };

    return (
        <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
                mt: 3,
                mb: 2,
            }}
        >
            {text}
        </Button>
    );
};

export default SubmitButton;
