import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
};

export const chatSetFromDB = createAction("chat/setFromDB");
export const chatAdd = createAction("chat/add");
export const chatModerate = createAction("chat/moderate");
export const chatAlert = createAction("chat/alert");
export const chatDeleteOldest = createAction("chat/deleteOldest");

const chatReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(chatSetFromDB, (draft, action) => {
            draft.messages = action.payload;
        })
        .addCase(chatAdd, (draft, action) => {
            draft.messages.push(action.payload);
        })
        .addCase(chatModerate, (draft, action) => {
            draft.messages[action.payload.index].moderation =
                action.payload.moderation;
        })
        .addCase(chatAlert, (draft, action) => {
            draft.messages[action.payload.index].alert = action.payload.alert;
        })
        .addCase(chatDeleteOldest, (draft, action) => {
            //
        });
});

export default chatReducer;
