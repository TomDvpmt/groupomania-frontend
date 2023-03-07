const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const connectToDb = require("../database/db-connect-mysql");

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

exports.signUp = async (req, res, next) => {

    const hash = await bcrypt.hash(req.body.password, 10);

    connectToDb()
        .then(connection => {
            connection.execute(`
                INSERT INTO users (email, passwordHash)
                VALUES (?, ?)
            `,
            [req.body.email, hash]
            )
                .then(() => {
                    console.log("======= Utilisateur créé. ==========");
                    close(connection);
                    return res.status(201);
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
                    if(count != 1) {
                        close(connection);
                        return res.status(401).json({message: "Email ou mot de passe invalide."});
                    }
                    else {
                        connection.execute(`
                            SELECT id, passwordHash
                            FROM users
                            WHERE email = ?
                        `, [email])
                            .then(([rows]) => {
                                const userId = rows[0].id;
                                const passwordHash = rows[0].passwordHash;
                                bcrypt.compare(password, passwordHash)
                                .then(isValidPassword => {
                                    if(!isValidPassword) {
                                        close(connection);
                                        return res.status(401).json({message: "Email ou mot de passe invalide."})
                                    }
                                    else {
                                        close(connection);
                                        res.status(200).json({
                                            userId: userId,
                                            token: jwt.sign(
                                                {userId: userId},
                                                process.env.TOKEN_CREATION_PHRASE
                                            )
                                        });
                                    }
                                })
                                .catch(() => res.status(500).json({message: "Oops !"}))
                            })
                    }
                })
                .catch(error => {
                    console.log("======== Erreur : ", error)
                })
        })
        .catch(error => console.error("=========== Impossible de se connecter à la base de données :", error))
};