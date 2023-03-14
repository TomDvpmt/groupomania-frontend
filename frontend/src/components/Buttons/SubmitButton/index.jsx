import { Button } from "@mui/material";

const SubmitButton = ({ text }) => {
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
