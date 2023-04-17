import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

export const setChatPostsFromDB = createAction("setChatPostsFromDB");
export const addChatPost = createAction("addChatPost");
export const moderateChatPost = createAction("moderateChatPost");
export const deleteOldestChatPost = createAction("deleteOldestChatPost");

const chatReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(setChatPostsFromDB, (draft, action) => {
            draft.posts = action.payload;
            return;
        })
        .addCase(addChatPost, (draft, action) => {
            draft.posts.push(action.payload);
            return;
        })
        .addCase(moderateChatPost, (draft, action) => {
            //
            return;
        })
        .addCase(deleteOldestChatPost, (draft, action) => {
            //
            return;
        });
});

export default chatReducer;
