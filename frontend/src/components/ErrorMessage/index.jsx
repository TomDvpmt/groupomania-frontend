import { Typography } from "@mui/material";
import { myTheme } from "../../utils/theme";

const ErrorMessage = ({ errorMessage }) => {
    return (
        <Typography color={myTheme.palette.error.main} ml={1} mt={1}>
            {errorMessage}
        </Typography>
    );
};

export default ErrorMessage;
