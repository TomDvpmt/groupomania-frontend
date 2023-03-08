import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../components/Header/index";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <React.Fragment>
            <Header />
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route
                    path="/signup"
                    element={<SignUp setToken={setToken} />}
                />
                <Route
                    path="/"
                    element={
                        token === null ? (
                            <Navigate to="/login" />
                        ) : (
                            <Home token={token} />
                        )
                    }
                />
            </Routes>
        </React.Fragment>
    );
};

export default App;
