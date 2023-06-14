import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user";
import postsReducer from "../features/posts";
import chatReducer from "../features/chat";
import profileReducer from "../features/profile";

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        chat: chatReducer,
        profile: profileReducer,
    },
    devTools: false,
});

export default store;
