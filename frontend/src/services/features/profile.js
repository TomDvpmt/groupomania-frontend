import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
};

export const profileUpdate = createAction("profile/update");

const profileReducer = createReducer(initialState, (builder) => {
    return builder.addCase(profileUpdate, (draft, action) => {
        return action.payload;
    });
});

export default profileReducer;
