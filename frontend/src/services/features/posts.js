import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const postsSetFromDB = createAction("posts/setFromDB");
export const postsAdd = createAction("posts/add");
export const postsUpdate = createAction("posts/update");
export const postsDelete = createAction("posts/delete");

const postsReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(postsSetFromDB, (draft, action) => {
            draft.messages = action.payload;
        })
        .addCase(postsAdd, (draft, action) => {
            draft.messages.push(action.payload);
        })
        .addCase(postsUpdate, (draft, action) => {
            //
        })
        .addCase(postsDelete, (draft, action) => {
            //
        });
});

export default postsReducer;
