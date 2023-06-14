import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    limit: 100, // if change, also change .env in backend !
    messages: [],
    users: [],
};

export const chatSetUsersFromSocket = createAction("chat/setUsersFromSocket");
export const chatSetMessagesFromSocket = createAction("chat/setFromSocket");
export const chatAddMessage = createAction("chat/messages/add");
export const chatModerate = createAction("chat/messages/moderate");
export const chatAlert = createAction("chat/messages/alert");
export const chatRemoveOldest = createAction("chat/messages/removeOldest");
export const chatLogout = createAction("chat/logout");

const chatReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(chatSetUsersFromSocket, (draft, action) => {
            draft.users = action.payload;
        })
        .addCase(chatSetMessagesFromSocket, (draft, action) => {
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
        .addCase(chatRemoveOldest, (draft, action) => {
            draft.messages.shift();
        })
        .addCase(chatLogout, (draft, action) => {
            return initialState;
        });
});

export default chatReducer;
