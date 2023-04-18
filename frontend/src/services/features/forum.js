import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
};

export const forumSetPostsFromDB = createAction("forum/setPostsFromDB");
export const forumSetPostCommentsFromDB = createAction(
    "forum/setCommentsFromDB"
);
export const forumAddPost = createAction("forum/addPost");
export const forumUpdatePost = createAction("forum/updatePost");
export const forumDeletePost = createAction("forum/deletePost");

const forumReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(forumSetPostsFromDB, (draft, action) => {
            draft.posts = action.payload;
        })
        .addCase(forumSetPostCommentsFromDB, (draft, action) => {
            draft.posts.filter(
                (post) => post.id === action.payload.postId
            )[0].comments = action.payload.comments;
        })
        .addCase(forumAddPost, (draft, action) => {
            draft.posts.push(action.payload);
        })
        .addCase(forumUpdatePost, (draft, action) => {
            //
        })
        .addCase(forumDeletePost, (draft, action) => {
            //
        });
});

export default forumReducer;
