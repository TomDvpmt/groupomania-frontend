import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/index";
import Login from "./pages/Login/index";
import SignUp from "./pages/SignUp/index";
import Home from "./pages/Home/index";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Header />
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
