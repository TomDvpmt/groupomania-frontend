import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
    users: [],
};

export const loggedUsersAdd = createAction("loggedUsers/add");
export const loggedUsersRemove = createAction("loggedUsers/remove");

const usersReducer = createReducer(initialState, (builder) => {
    return builder;
});

export default usersReducer;
