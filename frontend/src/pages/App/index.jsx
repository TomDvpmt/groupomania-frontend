import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/Header/index";
import Login from "../Login/index";
import SignUp from "../SignUp/index";
import Home from "../Home/index";

const App = () => {
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    return (
        <React.Fragment>
            <Header />
            <Routes>
                <Route
                    path="/login"
                    element={
                        <Login
                            setIsAdmin={setIsAdmin}
                            setLoggedUserId={setLoggedUserId}
                        />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <SignUp
                            setIsAdmin={setIsAdmin}
                            setLoggedUserId={setLoggedUserId}
                        />
                    }
                />
                <Route
                    path="/"
                    element={
                        <Home
                            isAdmin={isAdmin}
                            setIsAdmin={setIsAdmin}
                            loggedUserId={loggedUserId}
                        />
                    }
                />
            </Routes>
        </React.Fragment>
    );
};

export default App;
