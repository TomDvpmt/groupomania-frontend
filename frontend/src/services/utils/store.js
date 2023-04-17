import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "../features/chat";
import userReducer from "../features/user";

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    },
    devTools: true,
});

export default store;
