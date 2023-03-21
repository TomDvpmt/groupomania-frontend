/** Strips an input from undesirable characters to prevent XSS
 *
 * @param {String} input
 * @returns {String}
 */

export const sanitize = (input) => {
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

/** A list of image MIME types
 */

export const imgMimeTypes = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/bmp": "bmp",
    "image/webp": "webp",
};

/** Tests if a string input matches a regex
 *
 * @param { String } inputName
 * @param { String } stringToTest
 * @returns { Boolean }
 */

const isValidInput = (inputName, stringToTest) => {
    const nameRegex = new RegExp(
        /(^[a-zà-ÿ][a-zà-ÿ-']?)+([a-zà-ÿ-' ]+)?[a-zà-ÿ']$/i
    );
    const emailRegex = new RegExp(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const passwordRegex = new RegExp(/.{4,}/);

    const regexs = {
        firstName: nameRegex,
        lastName: nameRegex,
        email: emailRegex,
        password: passwordRegex,
    };

    return regexs[inputName].test(stringToTest);
};

const notRequiredFields = ["firstName", "lastName"];

class InputField {
    constructor(name, state, emptyMessage, invalidMessage, errorSetter) {
        this.name = name;
        this.errors = {
            isEmpty: {
                condition: !notRequiredFields.includes(name) && state === "",
                message: emptyMessage,
            },
            isInvalid: {
                condition:
                    !(notRequiredFields.includes(name) && state === "") &&
                    !isValidInput(name, state),
                message: invalidMessage,
            },
        };
        this.errorSetter = errorSetter;
    }
}

/** Gets the requested input fields from a form
 *
 * @param {Array} requestedFields
 * @returns {Array}
 */

export const getInputFields = (requestedFields) => {
    const inputFields = requestedFields.map((field) => {
        return new InputField(...field);
    });
    return inputFields;
};

/** Checks errors on a form's fields
 *
 * @param {Array} fields
 * @returns {Number} -
 */

export const checkInputErrors = (fields) => {
    const hasErrors = fields.reduce(
        (acc, field) =>
            acc ||
            field.errors.isEmpty.condition ||
            field.errors.isInvalid.condition,
        false
    );
    return hasErrors;
};

/** Sets the eventual error messages on the form's fields (form validation).
 *
 * @param { Array } fields
 */

export const setInputErrorMessages = (fields) => {
    fields.forEach((field) => {
        if (field.errors.isEmpty.condition) {
            field.errorSetter(field.errors.isEmpty.message);
        } else if (field.errors.isInvalid.condition) {
            field.errorSetter(field.errors.isInvalid.message);
        }
    });
};
