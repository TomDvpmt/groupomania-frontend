import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./layout/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./assets/styles/theme";

const Router = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/users/:userId" element={<Profile />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default Router;
