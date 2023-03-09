const connectToDb = require("../database/db-connect-mysql");

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

const handleError = (error, message, status) => {
    console.log(message, error);
    res.status(status).json({message: message});
}

exports.getAllPosts = (req, res, next) => {
    connectToDb()
    .then(connection => {
        connection.execute(
            `
                SELECT 
                    posts.id, 
                    posts.user_id, 
                    posts.content, 
                    posts.img_url, 
                    posts.created_at, 
                    users.id, 
                    users.email
                FROM posts
                JOIN users
                ON posts.user_id = users.id
                ORDER BY created_at DESC
            `, [])
            .then(([rows]) => {
                const results = [];
                for(let i = 0 ; i < rows.length ; i++) {
                    results[i] = 
                        {
                            id: rows[i].id,
                            postUserId: rows[i].user_id,
                            email: rows[i].email,
                            content: rows[i].content,
                            imgUrl: rows[i].img_url,
                            date: rows[i].created_at
                        };
                }
                return {
                    posts: results, 
                    admin: req.auth.admin === 1, 
                    loggedUserId: req.auth.userId
                };
            })
            .then((response) => {
                close(connection);
                res.status(200).json(response);
            })
            .catch(error => {
                close(connection);
                handleError(error, "Impossible de récupérer les données.", 400);
            } )
    })
    .catch(error => {
        handleError(error, "Impossible de se connecter à la base de données.", 500);
    })
};

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    connectToDb()
    .then(connection => {
        connection.execute(`
            SELECT content, img_url
            FROM posts
            WHERE id = ?
        `, [postId])
        .then(([rows]) => {
            const content = rows[0].content;
            const imgUrl = rows[0].img_url;
            const response = {
                content: content,
                imgUrl: imgUrl
            };
            return response;
        })
        .then(response => {
            close(connection);
            res.status(200).json(response);
        })
        .catch(error => {
            handleError(error, "Impossible de récupérer les données du message.", 400)
        }
        )
    })
    .catch(error => {
        handleError(error, "Impossible de se connecter à la base de données.", 500);
    })
};

exports.createPost = (req, res, next) => {

    const userId = req.auth.userId;
    const content = req.body.content;
    const imgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    const createdAt = Date.now();

    if(!content && !imgUrl) {
        res.status(400).json({message: "Le message ne peut pas être vide."})
    }
    else {
        connectToDb()
        .then(connection => {
            connection.execute(
                `
                INSERT INTO posts (user_id, content, img_url, created_at)
                VALUES (?, ?, ?, ?)
                `,
                [userId, content, imgUrl, createdAt]
            )
            .then(() => {
                close(connection);
                console.log("Message ajouté à la base de données.");
                res.status(201).json();
                
            })
            .catch(error => {
                close(connection);
                console.error("Impossible de publier le message :", error);
                res.status(400).json({message: "Impossible de publier le message."});
            })
        })
        .catch(error => {
            handleError(error, "Impossible de se connecter à la base de données.", 500);
        })
        
    }
};

exports.updatePost = (req, res, next) => {
    const content = req.body.content;
    const postId = req.params.id;
    connectToDb()
    .then(connection => {
        if(req.file) {
            const imgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            connection.execute(
                `UPDATE posts
                SET 
                    content = ?,
                    img_url = ?
                WHERE id = ?`, 
                [content, imgUrl, postId])
            .then(() => {
                close(connection);
                console.log("Post mis à jour.")
                res.status(200).json({message: "Message mis à jour."})
            })
            .catch(error => {
                close(connection);
                handleError(error, "Mise à jour du message impossible.", 400);
            })
        } else {
            connection.execute(
                `UPDATE posts
                SET content = ?
                WHERE id = ?`, 
                [content, postId])
            .then(() => {
                close(connection);
                console.log("Post mis à jour.")
                res.status(200).json({message: "Message mis à jour."})
            })
            .catch((error) => {
                close(connection);
                handleError(error, "Mise à jour du message impossible.", 400);
            })
        }
    })
    .catch(error => {
        handleError(error, "Impossible de se connecter à la base de données.", 500);
    })
    
};

exports.deletePost = (req, res, next) => {

};

exports.likePost = (req, res, next) => {

};