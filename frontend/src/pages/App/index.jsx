import React from "react";
import { Routes, Route } from "react-router-dom";
import NoNavLayout from "../../layout/NoNavLayout";
import NavLayout from "../../layout/NavLayout";
import Login from "../Login";
import SignUp from "../SignUp";
import Home from "../Home";
import Chat from "../Chat";
import Profile from "../Profile";
import Error404 from "../Error404";

const App = () => {
    const isLogged = localStorage.getItem("token");
    return (
        <Routes>
            <Route element={<NoNavLayout isLogged={false} />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route element={<NavLayout page="home" isLogged={true} />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<NavLayout page="chat" isLogged={true} />}>
                <Route path="/chat" element={<Chat />} />
            </Route>
            <Route element={<NavLayout page="profile" isLogged={true} />}>
                <Route path="/users/:userId" element={<Profile />} />
            </Route>
            <Route element={<NavLayout page="error404" isLogged={isLogged} />}>
                <Route path="*" element={<Error404 />} />
            </Route>
        </Routes>
    );
};

export default App;
