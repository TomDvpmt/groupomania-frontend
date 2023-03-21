import { CircularProgress } from "@mui/material";

const Loader = () => {
    return (
        <CircularProgress
            sx={{
                display: "block",
                margin: "5rem auto",
            }}
            size="5rem"
        />
    );
};

export default Loader;
