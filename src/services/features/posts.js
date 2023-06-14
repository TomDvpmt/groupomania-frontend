import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const postsSetFromDB = createAction("posts/setFromDB");
export const postAdd = createAction("posts/add");
export const postUpdate = createAction("posts/update");
export const postDelete = createAction("posts/delete");
export const postSetCommentsFromDB = createAction("posts/setCommentsFromDB");
export const postAddComment = createAction("posts/addComment");
export const postCommentUpdate = createAction("posts/commentUpdate");
export const postCommentDelete = createAction("posts/commentDelete");

const postsReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(postsSetFromDB, (draft, action) => {
            draft.messages = action.payload;
        })
        .addCase(postAdd, (draft, action) => {
            draft.messages.push(action.payload);
        })
        .addCase(postUpdate, (draft, action) => {
            const post = draft.messages.find(
                (post) => post.id === action.payload.messageId
            );
            post[action.payload.type] = action.payload.content;
        })
        .addCase(postDelete, (draft, action) => {
            draft.messages = draft.messages.filter(
                (post) => post.id !== action.payload
            );
        })
        .addCase(postSetCommentsFromDB, (draft, action) => {
            const post = draft.messages.find(
                (post) => post.id === action.payload.postId
            );
            post.comments = action.payload.comments;
        })
        .addCase(postAddComment, (draft, action) => {
            const post = draft.messages.find(
                (post) => post.id === action.payload.postId
            );
            post.comments.push(action.payload.comment);
        })
        .addCase(postCommentUpdate, (draft, action) => {
            const post = draft.messages.find(
                (post) => post.id === action.payload.parentId
            );
            const comment = post.comments.find(
                (comment) => comment.id === action.payload.messageId
            );
            comment[action.payload.type] = action.payload.content;
        })
        .addCase(postCommentDelete, (draft, action) => {
            const post = draft.messages.find(
                (post) => post.id === action.payload.parentId
            );
            post.comments = post.comments.filter(
                (comment) => comment.id !== action.payload.commentId
            );
        });
});

export default postsReducer;
