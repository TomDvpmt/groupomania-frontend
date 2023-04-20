import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./layout/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";

import { selectUserIsLoggedIn } from "./services/utils/selectors";

const RouterWrapper = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

const Router = () => {
    const isLoggedIn = useSelector(selectUserIsLoggedIn());

    const router = createBrowserRouter([
        {
            element: <RouterWrapper />,
            children: [
                {
                    path: "/",
                    element: isLoggedIn ? <Home /> : <Login />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/signup",
                    element: <SignUp />,
                },
                {
                    path: "/users/:userId",
                    element: isLoggedIn ? <Profile /> : <Login />,
                },
                {
                    path: "/chat",
                    element: isLoggedIn ? <Chat /> : <Login />,
                },
                {
                    path: "*",
                    element: <Error404 />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default Router;
