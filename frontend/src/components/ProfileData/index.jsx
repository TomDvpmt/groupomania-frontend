import { useSelector } from "react-redux";

import {
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
} from "../../services/utils/selectors";

import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";

const ProfileData = () => {
    const firstName = useSelector(selectUserFirstName());
    const lastName = useSelector(selectUserLastName());
    const email = useSelector(selectUserEmail());

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
