import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    id: 0,
    admin: 0,
    isLoggedIn: false,
    firstName: "",
    lastName: "",
    email: "",
    hasJoinedChat: false,
};

export const userSetIsLoggedIn = createAction("user/login");
export const userSetInfo = createAction("user/setInfo");
export const userSetFirstName = createAction("user/setFirstName");
export const userSetLastName = createAction("user/setLastName");
export const userSetEmail = createAction("user/setEmail");
export const userToggleHasJoinedChat = createAction("user/toggleHasJoinedChat");
export const userLogOut = createAction("user/logOut");

const userReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(userSetIsLoggedIn, (draft, action) => {
            draft.isLoggedIn = true;
        })
        .addCase(userSetInfo, (draft, action) => {
            draft.id = action.payload.id;
            draft.admin = action.payload.admin;
            draft.firstName = action.payload.firstName;
            draft.lastName = action.payload.lastName;
            draft.email = action.payload.email;
        })
        .addCase(userSetFirstName, (draft, action) => {
            draft.firstName = action.payload;
        })
        .addCase(userSetLastName, (draft, action) => {
            draft.lastName = action.payload;
        })
        .addCase(userSetEmail, (draft, action) => {
            draft.email = action.payload;
        })
        .addCase(userToggleHasJoinedChat, (draft, action) => {
            draft.hasJoinedChat = !draft.hasJoinedChat;
        })
        .addCase(userLogOut, (draft, action) => {
            return initialState;
        });
});

export default userReducer;
