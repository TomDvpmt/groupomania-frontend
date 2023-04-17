import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

export const chatSetPostsFromDB = createAction("chat/setPostsFromDB");
export const chatAddPost = createAction("chat/addPost");
export const chatModeratePost = createAction("chat/moderatePost");
export const chatDeleteOldestPost = createAction("chat/deleteOldestPost");

const chatReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(chatSetPostsFromDB, (draft, action) => {
            draft.posts = action.payload;
            return;
        })
        .addCase(chatAddPost, (draft, action) => {
            draft.posts.push(action.payload);
            return;
        })
        .addCase(chatModeratePost, (draft, action) => {
            draft.posts[action.payload.index].moderated =
                action.payload.moderated;
            return;
        })
        .addCase(chatDeleteOldestPost, (draft, action) => {
            //
            return;
        });
});

export default chatReducer;
