const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");
const connectToDb = require("../database/db-connect-mysql");

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

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
            )
        });
        close(connection);
        console.log("======== Utilisateur créé et connecté à l'application. ==========")
    })
    .catch(error => console.log("============ Connexion à l'application impossible :", error));
}

exports.signUp = async (req, res, next) => {

    const hash = await bcrypt.hash(req.body.password, 10);

    connectToDb()
        .then(connection => {

            const email = req.body.email;

            connection.execute(`
                INSERT INTO users (email, passwordHash)
                VALUES (?, ?)
            `,
            [email, hash]
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
                            SELECT id, passwordHash, admin
                            FROM users
                            WHERE email = ?
                        `, [email])
                            .then(([rows]) => {
                                const userId = rows[0].id;
                                const admin = rows[0].admin;
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
                                            token: jwt.sign(
                                                {userId: userId, admin: admin},
                                                process.env.TOKEN_CREATION_PHRASE
                                            )
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