import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";
import PropTypes from "prop-types";

const ProfileData = ({ firstName, lastName, email }) => {
    ProfileData.propTypes = {
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
    };

    const rows = [
        {
            label: "Prénom",
            value: firstName,
        },
        {
            label: "Nom",
            value: lastName,
        },
        {
            label: "E-mail",
            value: email,
        },
    ];

    return (
        <TableContainer>
            <Table sx={{ bgcolor: "white", borderRadius: 1 }}>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.label}
                            sx={{
                                "&:last-child td": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                }}
                            >
                                {row.label}
                            </TableCell>
                            <TableCell sx={{ overflowWrap: "anywhere" }}>
                                {row.value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProfileData;
