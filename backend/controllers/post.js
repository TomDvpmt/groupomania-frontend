const connectToDb = require("../database/db-connect-mysql");

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
                res.status(200).json(response);
            })
            .catch(error => {
                console.log("Impossible de récupérer les données :", error);
                res.status(400).json({message: "Impossible d'afficher les messages."});
            } )
    })
};

exports.getOnePost = (req, res, next) => {
    
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
        })
        .then(() => {
            res.status(201).json();
            console.log("Message ajouté à la base de données.");
        })
        .catch(error => {
           console.error("Impossible de publier le message :", error);
           res.status(400).json({message: "Impossible de publier le message."});
        })
    }
};

// if admin
exports.updatePost = (req, res, next) => {

};

// if admin
exports.deletePost = (req, res, next) => {

};

exports.likePost = (req, res, next) => {

};