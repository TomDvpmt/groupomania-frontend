import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header/index";
import Page from "./pages/Page";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Header />
        <Page />
    </React.StrictMode>
);
