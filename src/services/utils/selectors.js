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

export const selectUserHasJoinedChat = () => {
    return (state) => state.user.hasJoinedChat;
};

// Posts & Comments

export const selectPostsCount = () => {
    return (state) => state.posts.messages.length;
};

export const selectPostCommentsCount = (postId) => {
    return (state) => {
        const post = state.posts.messages.filter(
            (post) => post.id === postId
        )[0];
        if (post && post.comments) {
            return post.comments.length;
        } else return 0;
    };
};

// Chat

export const selectChatLimit = () => {
    return (state) => state.chat.limit;
};

export const selectChatAllMessages = () => {
    return (state) => state.chat.messages;
};

export const selectChatMessageModeration = (index) => {
    return (state) => state.chat.messages[index].moderation;
};

export const selectChatMessageAlert = (index) => {
    return (state) => state.chat.messages[index].alert;
};

export const selectChatUsers = () => {
    return (state) => state.chat.users;
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
