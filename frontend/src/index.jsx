import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import NoNavLayout from "./layout/NoNavLayout";
import WithNavLayout from "./layout/WithNavLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Error404 from "./pages/Error404";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { myTheme } from "./utils/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={myTheme}>
                <CssBaseline />
                <Routes>
                    <Route element={<NoNavLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>
                    <Route element={<WithNavLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<Error404 />} />
                    </Route>
                </Routes>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);
