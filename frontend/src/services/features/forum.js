import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

export const forumSetPostsFromDB = createAction("forum/setPostsFromDB");
export const forumAddPost = createAction("forum/addPost");
export const forumUpdatePost = createAction("forum/updatePost");
export const forumDeletePost = createAction("forum/deletePost");

const forumReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(forumSetPostsFromDB, (draft, action) => {
            draft.posts = action.payload;
            return;
        })
        .addCase(forumAddPost, (draft, action) => {
            draft.posts.push(action.payload);
            return;
        })
        .addCase(forumUpdatePost, (draft, action) => {
            return;
        })
        .addCase(forumDeletePost, (draft, action) => {
            return;
        });
});

export default forumReducer;
