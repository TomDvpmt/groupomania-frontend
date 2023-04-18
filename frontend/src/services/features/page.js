import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    location: "login",
};

export const pageUpdateLocation = createAction("page/updateLocation");

const pageReducer = createReducer(initialState, (builder) => {
    return builder.addCase(pageUpdateLocation, (draft, action) => {
        draft.location = action.payload;
    });
});

export default pageReducer;
