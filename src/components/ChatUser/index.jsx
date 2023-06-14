import { Link as RouterLink } from "react-router-dom";

import { getFullName } from "../../utils/utils";

import { Typography, Link } from "@mui/material";

const ChatUser = ({ user }) => {
    const fullName = getFullName(user);

    return (
        <Typography component="span">
            <Link
                component={RouterLink}
                to={`/users/${user.id}`}
                underline="none"
            >
                {fullName}
            </Link>
        </Typography>
    );
};

export default ChatUser;
