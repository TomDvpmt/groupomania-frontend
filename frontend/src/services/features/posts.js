import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const postsSetFromDB = createAction("posts/setFromDB");
export const postsAdd = createAction("posts/add");
// export const postsUpdate = createAction("posts/update");
export const postsDelete = createAction("posts/delete");
export const postSetCommentsFromDB = createAction("posts/setCommentsFromDB");
export const postAddComment = createAction("posts/addComment");
export const postCommentDelete = createAction("posts/commentDelete");

const postsReducer = createReducer(initialState, (builder) => {
    return (
        builder
            .addCase(postsSetFromDB, (draft, action) => {
                draft.messages = action.payload;
            })
            .addCase(postsAdd, (draft, action) => {
                draft.messages.push(action.payload);
            })
            // .addCase(postsUpdate, (draft, action) => {
            //     //
            // })
            .addCase(postsDelete, (draft, action) => {
                draft.messages = draft.messages.filter(
                    (post) => post.id !== action.payload
                );
            })
            .addCase(postSetCommentsFromDB, (draft, action) => {
                const post = draft.messages.filter(
                    (post) => post.id === action.payload.postId
                )[0];
                post.comments = action.payload.comments;
            })
            .addCase(postAddComment, (draft, action) => {
                const post = draft.messages.filter(
                    (post) => post.id === action.payload.postId
                )[0];
                post.comments.push(action.payload.comment);
            })
            .addCase(postCommentDelete, (draft, action) => {
                const post = draft.messages.filter(
                    (post) => post.id === action.payload.parentId
                )[0];
                post.comments = post.comments.filter(
                    (comment) => comment.id !== action.payload.commentId
                );
            })
    );
});

export default postsReducer;
