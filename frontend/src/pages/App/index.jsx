import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/index";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";
import UpdatePost from "../UpdatePost";
import Error404 from "../Error404/Error404";

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
