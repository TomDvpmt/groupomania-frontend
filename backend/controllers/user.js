const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectToDb } = require("../database/db-connect-mysql");
const { close } = require("../utils/utils");
const { handleError } = require("../utils/utils");

/** Logs the user automatically after signing up
 *
 * @param {import("mysql2/promise").Connection} connection
 * @param {String} email
 * @param {Response} res
 */

const logAfterSignUp = async (connection, email, res) => {
    try {
        const [rows] = await connection.execute(
            `
            SELECT id, admin, first_name, last_name
            FROM users
            WHERE email = ?
        `,
            [email]
        );

        const userId = rows[0].id;
        const admin = rows[0].admin;
        const firstName = rows[0].first_name;
        const lastName = rows[0].last_name;

        close(connection);
        console.log(
            "======== Utilisateur créé et connecté à l'application. =========="
        );

        return res.status(201).json({
            token: jwt.sign(
                { userId, admin },
                process.env.TOKEN_CREATION_PHRASE
            ),
            userId,
            firstName,
            lastName,
            email,
        });
    } catch (error) {
        handleError(res, "Connexion à l'application impossible.", 400, error);
    }
};

/** Creates a user in the database
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.signUp = async (req, res, next) => {
    const hash = await bcrypt.hash(req.body.password, 10);

    connectToDb()
        .then((connection) => {
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;

            connection
                .execute(
                    `
                INSERT INTO users (first_name, last_name, email, password_hash)
                VALUES (?, ?, ?, ?)
            `,
                    [firstName, lastName, email, hash]
                )
                .then(() => {
                    logAfterSignUp(connection, email, res);
                })
                .catch((error) => {
                    console.log(
                        "========= Impossible de créer l'utilisateur :",
                        error
                    );
                    if (error.code === "ER_DUP_ENTRY") {
                        close(connection);
                        return res.status(400).json({
                            message:
                                "Cet email est déjà utilisé, veuillez en choisir un autre.",
                        });
                    }
                });
        })
        .catch((error) =>
            console.error(
                "Impossible de se connecter à la base de données :",
                error
            )
        );
};

/** Logs the user in
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    connectToDb("Login")
        .then((connection) => {
            connection
                .execute(
                    `
                SELECT COUNT(*) AS count
                FROM users
                WHERE email = ?
            `,
                    [email]
                )
                .then(([rows]) => {
                    const count = rows[0].count;

                    if (count === 1) {
                        connection
                            .execute(
                                `
                            SELECT id, admin, first_name, last_name, password_hash, admin
                            FROM users
                            WHERE email = ?
                        `,
                                [email]
                            )
                            .then(([rows]) => {
                                const userId = rows[0].id;
                                const admin = rows[0].admin;
                                const firstName = rows[0].first_name;
                                const lastName = rows[0].last_name;
                                const passwordHash = rows[0].password_hash;
                                bcrypt
                                    .compare(password, passwordHash)
                                    .then((isValidPassword) => {
                                        if (!isValidPassword) {
                                            throw new Error();
                                        } else {
                                            close(connection);
                                            res.status(200).json({
                                                token: jwt.sign(
                                                    { userId, admin },
                                                    process.env
                                                        .TOKEN_CREATION_PHRASE
                                                ),
                                                userId,
                                                admin,
                                                firstName,
                                                lastName,
                                                email,
                                            });
                                            console.log(
                                                "======== Utilisateur connecté à l'application. =========="
                                            );
                                        }
                                    })
                                    .catch((error) => {
                                        close(connection);
                                        handleError(
                                            res,
                                            "Email ou mot de passe invalide.",
                                            401,
                                            error
                                        );
                                    });
                            })
                            .catch(() => {
                                close(connection);
                                handleError(
                                    res,
                                    "Connexion à l'application impossible.",
                                    400,
                                    error
                                );
                            });
                    } else {
                        throw new Error();
                    }
                })
                .catch((error) => {
                    close(connection);
                    handleError(
                        res,
                        "Email ou mot de passe invalide.",
                        401,
                        error
                    );
                });
        })
        .catch((error) =>
            console.error(
                "=========== Impossible de se connecter à la base de données :",
                error
            )
        );
};

/** Gets a user's info
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.getOneUser = async (req, res, next) => {
    const userId = req.auth.userId;
    const paramUserId =
        parseInt(req.params.userId) === 0
            ? userId
            : parseInt(req.params.userId);
    const modifiable = req.auth.admin || paramUserId === userId;

    const connection = await connectToDb("getOneUser");

    try {
        const [rows] = await connection.execute(
            `
            SELECT id, admin, first_name, last_name, email
            FROM users
            WHERE id = ?
            `,
            [paramUserId]
        );
        close(connection);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Page introuvable." });
        } else {
            return res.status(200).json({
                id: rows[0].id,
                admin: rows[0].admin,
                firstName: rows[0].first_name ? rows[0].first_name : "",
                lastName: rows[0].last_name ? rows[0].last_name : "",
                email: rows[0].email,
                modifiable: modifiable,
            });
        }
    } catch (error) {
        handleError(res, "Impossible d'afficher les informations.", 400, error);
    }
};

/** Updates a user's info
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.updateUser = async (req, res, next) => {
    const paramUserId = parseInt(req.params.userId);
    const loggedUserId = req.auth.userId;
    const firstName = req.body.firstName ? req.body.firstName : null;
    const lastName = req.body.lastName ? req.body.lastName : null;
    const email = req.body.email;

    if (!req.auth.admin && paramUserId !== loggedUserId) {
        return res.status(401).json({ message: "Non autorisé" });
    } else {
        const connection = await connectToDb("updateUser");

        try {
            connection.execute(
                `
                UPDATE users
                SET first_name = ?, last_name = ?, email = ?
                WHERE id = ?
            `,
                [firstName, lastName, email, paramUserId]
            );

            close(connection);
            return res.status(200).json({ firstName, lastName, email });
        } catch (error) {
            handleError(
                res,
                "Impossible de mettre à jour l'utilisateur.",
                400,
                error
            );
        }
    }
};

/** Removes a user from the database
 *
 * @param {Request} req
 * @param {Response} res
 */

exports.deleteUser = async (req, res, next) => {
    const paramUserId = parseInt(req.params.userId);
    const loggedUserId = req.auth.userId;

    if (!req.auth.admin && paramUserId !== loggedUserId) {
        return res.status(401).json({ message: "Non autorisé" });
    } else {
        const connection = await connectToDb("deleteUser");
        try {
            connection.execute(
                `
                DELETE from users
                WHERE id = ?
            `,
                [paramUserId]
            );

            close(connection);
            return res.status(200).json({ message: "Utilisateur supprimé." });
        } catch (error) {
            close(connection);
            handleError(
                res,
                "Impossible de supprimer l'utilisateur.",
                400,
                error
            );
        }
    }
};
