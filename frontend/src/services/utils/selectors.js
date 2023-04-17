// User

export const selectUserIsLoggedIn = () => {
    return (state) => state.user.isLoggedIn;
};

export const selectUserId = () => {
    return (state) => state.user.id;
};

export const selectUserAdminStatus = () => {
    return (state) => state.user.admin;
};

export const selectUserFirstName = () => {
    return (state) => state.user.firstName;
};

export const selectUserLastName = () => {
    return (state) => state.user.lastName;
};

export const selectUserEmail = () => {
    return (state) => state.user.email;
};

// Chat

export const selectChatPosts = () => {
    return (state) => state.chat.posts;
};
