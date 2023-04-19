import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const commentsSetFromDB = createAction("comments/setFromDB");
export const commentsAdd = createAction("comments/add");
export const commentsUpdate = createAction("comments/update");
export const commentsDelete = createAction("comments/delete");

const commentsReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(commentsSetFromDB, (draft, action) => {
            draft.messages = action.payload;
            return;
        })
        .addCase(commentsAdd, (draft, action) => {
            draft.messages.push(action.payload);
            return;
        })
        .addCase(commentsUpdate, (draft, action) => {
            //
        })
        .addCase(commentsDelete, (draft, action) => {
            //
        });
});

export default commentsReducer;
