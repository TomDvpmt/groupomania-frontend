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

// Page

export const selectPageLocation = () => {
    return (state) => state.page.location;
};

// Forum

export const selectForumPosts = () => {
    return (state) => state.forum.posts;
};

// Chat

export const selectChatPosts = () => {
    return (state) => state.chat.posts;
};

export const selectChatPostModeration = (index) => {
    return (state) => state.chat.posts[index].moderated;
};
