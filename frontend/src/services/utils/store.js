import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user";
// import pageReducer from "../features/page";
import postsReducer from "../features/posts";
import commentsReducer from "../features/comments";
import chatReducer from "../features/chat";
import profileReducer from "../features/profile";

const store = configureStore({
    reducer: {
        user: userReducer,
        // page: pageReducer,
        posts: postsReducer,
        comments: commentsReducer,
        chat: chatReducer,
        profile: profileReducer,
    },
    devTools: true,
});

export default store;
