import { useSelector } from "react-redux";

import {
    selectProfileFirstName,
    selectProfileLastName,
    selectProfileEmail,
} from "../../services/utils/selectors";

import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";

const ProfileData = () => {
    const profileFirstName = useSelector(selectProfileFirstName());
    const profileLastName = useSelector(selectProfileLastName());
    const profileEmail = useSelector(selectProfileEmail());

    const rows = [
        {
            label: "Prénom",
            value: profileFirstName,
        },
        {
            label: "Nom",
            value: profileLastName,
        },
        {
            label: "E-mail",
            value: profileEmail,
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
