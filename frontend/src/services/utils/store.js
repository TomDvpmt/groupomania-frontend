import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user";
import postsReducer from "../features/posts";
import chatReducer from "../features/chat";
import profileReducer from "../features/profile";
// import commentsReducer from "../features/comments";
// import pageReducer from "../features/page";

const store = configureStore({
    reducer: {
        user: userReducer,
        posts: postsReducer,
        chat: chatReducer,
        profile: profileReducer,
        // comments: commentsReducer,
        // page: pageReducer,
    },
    devTools: true,
});

export default store;
