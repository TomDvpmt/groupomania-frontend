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

// Forum

export const selectAllPosts = () => {
    return (state) => state.posts.messages;
};

// Chat

export const selectAllChatMessages = () => {
    return (state) => state.chat.messages;
};

export const selectChatMessageModeration = (index) => {
    return (state) => state.chat.messages[index].moderation;
};

export const selectChatMessageAlert = (index) => {
    return (state) => state.chat.messages[index].alert;
};

// Profile

export const selectProfileFirstName = () => {
    return (state) => state.profile.firstName;
};

export const selectProfileLastName = () => {
    return (state) => state.profile.lastName;
};

export const selectProfileEmail = () => {
    return (state) => state.profile.email;
};
