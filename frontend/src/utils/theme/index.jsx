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
        error: {
            main: "#FF0000",
        },
    },
    typography: {
        fontFamily: "Lato, Helvetica Neue, Arial, sans-serif",
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

    // Custom properties
    maxWidth: {
        desktop: 800,
    },
    form: {
        margin: "1rem .5rem",
        display: "flex",
        flexDirection: "column",
    },
});
