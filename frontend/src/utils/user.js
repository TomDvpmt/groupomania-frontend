exports.fetchCredentials = (endpoint, credentialsData) => {
    const response = fetch(
        `${process.env.REACT_APP_BACKEND_URI}/API/auth/${endpoint}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentialsData),
        }
    );
    return response;
};

exports.sanitize = (input) => {
    const htmlCodes = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
        "`": "&#x60;",
        "=": "&#x3D;",
    };
    const regExp = /[&<>"'`=/]/gi;
    return input.replace(regExp, (match) => htmlCodes[match]);
};
