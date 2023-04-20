import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import store from "./services/utils/store";

import Router from "./Router";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./assets/styles/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router />
            </ThemeProvider>
        </React.StrictMode>
    </Provider>
);
