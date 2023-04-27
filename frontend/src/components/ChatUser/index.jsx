import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";

const ChatUser = ({ user }) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const fullName =
        firstName || lastName
            ? `${firstName}${firstName && lastName ? " " : ""}${lastName}`
            : `Anonyme (${user.email})`;
    return (
        <Typography component="span">
            <Link component={RouterLink} to={`/users/${user.id}`}>
                {fullName}
            </Link>
        </Typography>
    );
};

export default ChatUser;
