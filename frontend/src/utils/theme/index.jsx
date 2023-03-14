import { createTheme } from "@mui/material/styles";

export const myTheme = createTheme({
    palette: {
        primary: {
            main: "#FD2D01",
        },
        secondary: {
            main: "#FFD7D7",
        },
        tertiary: {
            main: "#4E5166",
        },
    },
    typography: {
        fontFamily: "Lato, Helvetica Neue, Arial, sans-serif",
    },
    form: {
        mb: 8,
        display: "flex",
        flexDirection: "column",
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F5F5F5",
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: "white",
                },
            },
        },
    },
});
