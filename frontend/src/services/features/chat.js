import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    messages: [],
    users: [],
};

export const chatSetFromDB = createAction("chat/messages/setFromDB");
export const chatAddMessage = createAction("chat/messages/add");
export const chatModerate = createAction("chat/messages/moderate");
export const chatAlert = createAction("chat/messages/alert");
export const chatDeleteOldest = createAction("chat/messages/deleteOldest");

const chatReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(chatSetFromDB, (draft, action) => {
            draft.messages = action.payload;
        })
        .addCase(chatAddMessage, (draft, action) => {
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
