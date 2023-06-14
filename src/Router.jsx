import React from "react";
import { useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    redirect,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import Header from "./layout/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";

import {
    chatSetUsersFromSocket,
    chatSetMessagesFromSocket,
} from "./services/features/chat";
import { socket } from "./socket";

const RouterWrapper = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

const Router = () => {
    // WebSocket

    const dispatch = useDispatch();

    const privateRouteLoader = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            return redirect("/login");
        }
        return null;
    };

    useEffect(() => {
        socket.on("receiveLoggedUsers", (users) => {
            dispatch(chatSetUsersFromSocket(users));
        });

        socket.on("receiveAllMessages", (messages) => {
            dispatch(chatSetMessagesFromSocket(messages));
        });

        return () => {
            socket.off("receiveLoggedUsers");
            socket.off("receiveAllMessages");
        };
    }, [dispatch]);

    // Router
    const router = createBrowserRouter([
        {
            element: <RouterWrapper />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                    loader: () => privateRouteLoader(),
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
                    element: <Profile />,
                    loader: () => privateRouteLoader(),
                },
                {
                    path: "/chat",
                    element: <Chat />,
                    loader: () => privateRouteLoader(),
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
