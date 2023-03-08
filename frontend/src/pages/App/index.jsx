import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../components/Header/index";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";

const App = () => {
    return (
        <React.Fragment>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </React.Fragment>
    );
};

export default App;
