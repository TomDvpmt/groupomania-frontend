import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

export const commentsSetPostsFromDB = createAction("comments/setPostsFromDB");
export const commentsAddPost = createAction("comments/addPost");
export const commentsUpdatePost = createAction("comments/updatePost");
export const commentsDeletePost = createAction("comments/deletePost");

const commentsReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(commentsSetPostsFromDB, (draft, action) => {
            draft.posts = action.payload;
            return;
        })
        .addCase(commentsAddPost, (draft, action) => {
            draft.posts.push(action.payload);
            return;
        })
        .addCase(commentsUpdatePost, (draft, action) => {
            //
        })
        .addCase(commentsDeletePost, (draft, action) => {
            //
        });
});

export default commentsReducer;
