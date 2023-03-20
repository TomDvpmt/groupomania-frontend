const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const connectToDb = require("../database/db-connect-mysql");


/** Closes connection to database
 * 
 * @param {import("mysql2/promise").Connection} connection
 */

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};


/** Handles error : sets res.status and the error message, and logs the error
 * 
 * @param {Response} res
 * @param {String} message 
 * @param {Number} status 
 * @param {Error} error
 */

const handleError = (res, message, status, error) => {
    console.log(message, error);
    res.status(status).json({message: message});
}



/** Logs the user automatically after signing up
 * 
 * @param {import("mysql2/promise").Connection} connection 
 * @param {String} email 
 * @param {Response} res 
 */

const logAfterSignUp = (connection, email, res) => {
    connection.execute(`
        SELECT id, admin
        FROM users
        WHERE email = ?
    `, [email])
    .then(([rows]) => {
        const userId = rows[0].id;
        const admin = rows[0].admin;
        res.status(201).json({
            token: jwt.sign(
                {userId: userId, admin: admin},
                process.env.TOKEN_CREATION_PHRASE
            ),
            userId: userId
        });
        close(connection);
        console.log("======== Utilisateur créé et connecté à l'application. ==========")
    })
    .catch(error => console.log("============ Connexion à l'application impossible :", error));
}


/** Creates a user in the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

exports.signUp = async (req, res, next) => {

    const hash = await bcrypt.hash(req.body.password, 10);

    connectToDb()
        .then(connection => {

            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email;
            
            connection.execute(`
                INSERT INTO users (first_name, last_name, email, password_hash)
                VALUES (?, ?, ?, ?)
            `,
            [firstName, lastName, email, hash]
            )
                .then(() => {
                    logAfterSignUp(connection, email, res);                   
                })
                .catch(error => {
                    console.log("========= Impossible de créer l'utilisateur :", error);
                    if(error.code === "ER_DUP_ENTRY") {
                        close(connection);
                        return res.status(400).json({message: "Cet email est déjà utilisé, veuillez en choisir un autre."});
                    }
                } )
        })   
        .catch(error => console.error("Impossible de se connecter à la base de données :", error))
};


/** Logs the user in
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    connectToDb()
        .then(connection => {
            connection.execute(`
                SELECT COUNT(*) AS count
                FROM users
                WHERE email = ?
            `, [email])
                .then(([rows]) => {
                    
                    const count = rows[0].count;

                    if(count === 1) {
                        connection.execute(`
                            SELECT id, password_hash, admin
                            FROM users
                            WHERE email = ?
                        `, [email])
                            .then(([rows]) => {
                                const userId = rows[0].id;
                                const admin = rows[0].admin;
                                const passwordHash = rows[0].password_hash;
                                bcrypt.compare(password, passwordHash)
                                .then(isValidPassword => {
                                    if(!isValidPassword) {
                                        close(connection);
                                        return res.status(401).json({message: "Email ou mot de passe invalide."})
                                    }
                                    else {
                                        close(connection);
                                        res.status(200).json({
                                            token: jwt.sign(
                                                {userId: userId, admin: admin},
                                                process.env.TOKEN_CREATION_PHRASE
                                            ),
                                            userId: userId
                                        });
                                        console.log("======== Utilisateur connecté à l'application. ==========")
                                    }
                                })
                                .catch(() => res.status(500).json({message: "Oops !"}))
                            })
                            .catch(() => console.log("============ Connexion à l'application impossible :", error));
                    }
                    else {
                        close(connection);
                        return res.status(401).json({message: "Email ou mot de passe invalide."});
                    }
                })
                .catch(error => {
                    console.log("======== Erreur : ", error)
                })
        })
        .catch(error => console.error("=========== Impossible de se connecter à la base de données :", error))
};


/** Gets a user's info
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

exports.getOneUser = (req, res, next) => {
    const paramUserId = parseInt(req.params.userId);
    const userId = req.auth.userId;
    const modifiable = req.auth.admin || paramUserId === userId;
    
        connectToDb("getOneUser")
        .then(connection => {
            connection.execute(`
                SELECT id, first_name, last_name, email
                FROM users
                WHERE id = ?
            `, [paramUserId])
            .then(([rows]) => {
                close(connection);
                if(rows.length === 0) {
                    res.status(404).json({message : "Page introuvable."})
                } else {
                    res.status(200).json({
                        firstName: rows[0].first_name,
                        lastName: rows[0].last_name,
                        email: rows[0].email,
                        modifiable: modifiable
                    });
                }
            })
            .catch(error => {
                close(connection);
                handleError(res, "Impossible de récupérer les données de l'utilisateur.", 400, error)
            })
        })
        .catch(error => {
            handleError(res, "Impossible de se connecter à la base de données.", 500, error)
        })
}

/** Updates a user's info
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

exports.updateUser = (req, res, next) => {
    const paramUserId = parseInt(req.params.userId);
    const loggedUserId = req.auth.userId;
    const firstName = req.body.firstName ? req.body.firstName : null;
    const lastName = req.body.lastName ? req.body.lastName : null;
    const email = req.body.email;

    if(!req.auth.admin && paramUserId !== loggedUserId) {
        res.status(401).json({message: "Non autorisé"});
    } else {
        connectToDb("updateUser")
        .then(connection => 
            connection.execute(`
                UPDATE users
                SET first_name = ?, last_name = ?, email = ?
                WHERE id = ?
            `, [firstName, lastName, email, paramUserId])
            .then(() => {
                close(connection);
                res.status(200).json({firstName, lastName, email});
            })
            .catch(error => {
                close(connection);
                handleError(res, "Impossible de mettre à jour l'utilisateur.", 400, error)
            }))
        .catch(error => {
            handleError(res, "Impossible de se connecter à la base de données.", 500, error)
        })
    }
}

/** Removes a user from the database
 * 
 * @param {Request} req 
 * @param {Response} res 
 */

exports.deleteUser = (req, res, next) => {
    const paramUserId = parseInt(req.params.userId);
    const loggedUserId = req.auth.userId;

    if(!req.auth.admin && paramUserId !== loggedUserId) {
        res.status(401).json({message: "Non autorisé"});
    } else {
        connectToDb("deleteUser")
        .then(connection => {
            connection.execute(`
                DELETE from users
                WHERE id = ?
            `, [paramUserId])
            .then(response => {
                close(connection);
                res.status(200).json({message: "Utilisateur supprimé."});
            })
            .catch(error => {
                close(connection);
                handleError(res, "Impossible de supprimer l'utilisateur.", 400, error)
            })
        })
        .catch(error => handleError(res, "Impossible de se connecter à la base de données.", 500, error))
    }
}