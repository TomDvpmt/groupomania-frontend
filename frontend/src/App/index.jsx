import React from "react";
import { Routes, Route } from "react-router-dom";
import WithNavLayout from "../layout/WithNavLayout";
import NoNavLayout from "../layout/NoNavLayout";
import Login from "../pages/Login/index";
import SignUp from "../pages/SignUp/index";
import Home from "../pages/Home/index";
import Error404 from "../pages/Error404/Error404";
import "./App.css";

const App = () => {
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

export default App;
