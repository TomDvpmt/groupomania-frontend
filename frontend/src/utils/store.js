import { configureStore } from "@reduxjs/toolkit";

import chatReducer from "../features/chat";

const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
    devTools: true,
});

export default store;
