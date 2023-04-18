import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user";
import pageReducer from "../features/page";
import forumReducer from "../features/forum";
import chatReducer from "../features/chat";

const store = configureStore({
    reducer: {
        user: userReducer,
        page: pageReducer,
        forum: forumReducer,
        chat: chatReducer,
    },
    devTools: true,
});

export default store;
