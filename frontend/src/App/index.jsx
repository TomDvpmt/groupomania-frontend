import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header/index";
import Login from "../pages/Login/index";
import SignUp from "../pages/SignUp/index";
import Home from "../pages/Home/index";
import UpdatePost from "../pages/UpdatePost";
import Error404 from "../pages/Error404/Error404";
import "./App.css";

const App = () => {
    return (
        <React.Fragment>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home />} />
                <Route path="/update/:id" element={<UpdatePost />} />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </React.Fragment>
    );
};

export default App;
