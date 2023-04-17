import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import store from "./services/utils/store";

import Router from "./Router";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <Router>
                <Router />
            </Router>
        </React.StrictMode>
    </Provider>
);
