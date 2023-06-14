import { Typography } from "@mui/material";
import { theme } from "../../assets/styles/theme";
import PropTypes from "prop-types";

const ErrorMessage = ({ errorMessage }) => {
    ErrorMessage.propTypes = {
        errorMessage: PropTypes.string,
    };

    return (
        <Typography color={theme.palette.error.main} ml={1} mt={1}>
            {errorMessage}
        </Typography>
    );
};

export default ErrorMessage;
