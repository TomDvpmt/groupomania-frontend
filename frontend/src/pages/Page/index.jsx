import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";

const Page = () => {
    const [token, setToken] = useState(null);

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={<Login token={token} setToken={setToken} />}
                />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default Page;
