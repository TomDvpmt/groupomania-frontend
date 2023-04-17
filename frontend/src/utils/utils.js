import store from "../services/utils/store";
import { userSetIsLoggedIn, userSetInfo } from "../services/features/user";
import { getUserInfo } from "./requests";

/** Formats a timestamp into a readable date
 *
 * @param {BigInt} timestamp
 * @returns {String}
 */

export const formatDate = (timestamp) => {
    const rawDate = new Date(timestamp);
    const hours =
        rawDate.getHours() < 10 ? `0${rawDate.getHours()}` : rawDate.getHours();
    const minutes =
        rawDate.getMinutes() < 10
            ? `0${rawDate.getMinutes()}`
            : rawDate.getMinutes();
    return `Le ${rawDate.toLocaleDateString()} à ${hours}:${minutes}`;
};

/**
 * Set Redux's state.user
 * @param {String} token
 */

export const setUserState = (token, navigate) => {
    if (
        token !== undefined &&
        token !== null &&
        token !== "null" &&
        token !== ""
    ) {
        getUserInfo(token)
            .then((data) => {
                store.dispatch(userSetIsLoggedIn());
                store.dispatch(userSetInfo(data));
            })
            .catch((error) => console.log(error));
    } else {
        navigate("/login");
    }
};
