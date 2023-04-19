import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            // red-pink
            main: "#FD2D01",
            light: "#FFD7D7",
            dark: "#ab1f02",
        },
        secondary: {
            // dark blue-grey
            main: "#4E5166",
        },
        text: {
            main: "black",
            light: "#9395a3",
        },
        error: {
            main: "#FF0000",
        },
        validation: {
            main: "green",
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
        alignItems: "center",
    },
});
