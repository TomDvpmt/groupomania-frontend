const fs = require("fs");

const connectToDb = require("../database/db-connect-mysql");

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

/**
 * @param {Response} res
 * @param {String} message 
 * @param {Number} status 
 * @param {Error} error
 */

const handleError = (res, message, status, error) => {
    console.log(message, error);
    res.status(status).json({message: message});
}

exports.getAllPosts = (req, res, next) => {

    const userId = req.auth.userId;
    const parentId = req.params.parentId;

    connectToDb("getAllPosts")
    .then(connection => {
        connection.execute(`
        SELECT id, parent_id, post_user_id, email, content, img_url, created_at, modified, likes_count, dislikes_count, current_user_like_value
        FROM 
            (SELECT 
                posts.id, 
                posts.parent_id,
                posts.user_id AS post_user_id, 
                users.email,
                posts.content, 
                posts.img_url, 
                posts.created_at,
                posts.modified, 
                users.id AS user_id
            FROM posts
            JOIN users
            ON posts.user_id = users.id) 
            AS posts_users
            LEFT JOIN 
                (SELECT COUNT(*) AS likes_count, post_id
                FROM likes
                WHERE like_value = 1
                GROUP BY post_id) 
                AS likes_table
            ON posts_users.id = likes_table.post_id
            LEFT JOIN 
                (SELECT COUNT(*) AS dislikes_count, post_id
                FROM likes
                WHERE like_value = -1
                GROUP BY post_id)
                AS dislikes_table
            ON posts_users.id = dislikes_table.post_id
            LEFT JOIN
            	(SELECT post_id, like_value AS current_user_like_value 
            	FROM likes
            	WHERE user_id = ?) AS user_likes_table
            ON posts_users.id = user_likes_table.post_id
        WHERE parent_id = ?
        ORDER BY created_at DESC
            `, [userId, parentId])
        .then(([rows]) => {

            const results = [];
            
            for(let i = 0 ; i < rows.length ; i++) {
                results[i] = rows[0].parent_id === 0 ?
                    {
                        id: rows[i].id,
                        parentId: 0,
                        postUserId: rows[i].post_user_id,
                        email: rows[i].email,
                        content: rows[i].content,
                        imgUrl: rows[i].img_url,
                        date: rows[i].created_at,
                        modified: rows[i].modified,
                        likesCount: rows[i].likes_count,
                        dislikesCount: rows[i].dislikes_count,
                        currentUserLikeValue: rows[i].current_user_like_value
                    } :
                    {
                        id: rows[i].id,
                        parentId: rows[0].parent_id,
                        commentUserId: rows[i].post_user_id,
                        email: rows[i].email,
                        content: rows[i].content,
                        imgUrl: rows[i].img_url,
                        date: rows[i].created_at,
                        modified: rows[i].modified,
                        likesCount: rows[i].likes_count,
                        dislikesCount: rows[i].dislikes_count,
                        currentUserLikeValue: rows[i].current_user_like_value
                    };
            };
            close(connection);
            return {
                results: results, 
                admin: req.auth.admin === 1, 
                loggedUserId: req.auth.userId
            };
        })
        .then((response) => {
            res.status(200).json(response);
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de récupérer les données.", 400, error);
        } )
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
};

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;

    connectToDb("getOnePost")
    .then(connection => {
        connection.execute(`
            SELECT content, img_url, modified
            FROM posts
            WHERE id = ?
        `, [postId])
        .then(([rows]) => {
            res.status(200).json({
                content: rows[0].content,
                imgUrl: rows[0].img_url,
                modified: rows[0].modified
            });
            close(connection);
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de récupérer les données du message.", 400, error)
        }
        )
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
};

exports.createPost = (req, res, next) => {

    const userId = req.auth.userId;
    const content = req.body.content;
    const parentId = req.body.parentId;
    const createdAt = Date.now();
    connectToDb("createPost")
    .then(connection => {
        if(!req.file && !req.body.content) {
            handleError(res, "Le message ne peut pas être vide.", 400);
        }
        const imgUrl = 
            req.file ? 
            `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : 
            "";
        connection.execute(
            `
            INSERT INTO posts (parent_id, user_id, content, img_url, created_at)
            VALUES (?, ?, ?, ?, ?)
            `,
            [parentId, userId, content, imgUrl, createdAt]
        )
        .then(() => {
            close(connection);
            console.log("Message ajouté à la base de données.");
            res.status(201).json();
            
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de publier le message.", 400, error);
        }) 
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.id;
    const content = req.body.content;
    const prevImgUrl = req.body.imgUrl ? req.body.imgUrl : "";

    connectToDb("updatePost")
    .then(connection => {
        if(req.file) {
            const newImgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            connection.execute(
                `UPDATE posts
                SET 
                    content = ?,
                    img_url = ?,
                    modified = 1
                WHERE id = ?`, 
                [content, newImgUrl, postId])
            .then(() => {
                close(connection);
                const formerFileName = prevImgUrl.split("/images/")[1];
                prevImgUrl !== "" && fs.unlink(`images/${formerFileName}`, (error) => {
                    if(error) handleError(res, "Chargement du fichier impossible.", 400, error);
                })
                console.log("Post mis à jour.")
                res.status(200).json({message: "Message mis à jour."})
            })
            .catch(error => {
                close(connection);
                handleError(res, "Mise à jour du message impossible.", 400, error);
            })
        } else {
            connection.execute(
                `UPDATE posts
                SET 
                    content = ?,
                    modified = 1
                WHERE id = ?`, 
                [content, postId])
            .then(() => {
                close(connection);
                console.log("Post mis à jour.")
                res.status(200).json({message: "Message mis à jour."})
            })
            .catch((error) => {
                close(connection);
                handleError(res, "Mise à jour du message impossible.", 400, error);
            })
        }
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
    
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    const imgUrl = req.body.imgUrl;
    connectToDb("deletePost")
        .then(connection => {
            connection.execute(`
                DELETE FROM posts
                WHERE id = ?
            `, [postId])
            .then(() => {
                close(connection);
                if(imgUrl) {
                    const fileName = imgUrl.split("/images/")[1];
                    fs.unlink(`images/${fileName}`, (error) => {
                        if(error) handleError(res, "Impossible de supprimer le fichier.", 400, error);
                    });
                }
                res.status(200).json();
            })
            .catch(error => {
                close(connection);
                handleError(res, "Impossible de supprimer le message.", 400, error);
            })
        })
        .catch(error => handleError(res, "Impossible de se connecter à la base de données.", 500, error));
};

exports.likePost = (req, res, next) => {
    const postId = req.params.id;
    const userId = req.auth.userId;
    const likeValue = JSON.parse(req.body.likeValue);

    connectToDb("likePost")
    .then(connection => {
        connection.execute(`
            SELECT like_value
            FROM likes
            WHERE user_id = ? AND post_id = ?
        `, [userId, postId])
        .then(([rows]) => {
            if(rows.length === 0) {
                connection.execute(`
                    INSERT INTO likes (user_id, post_id, like_value)
                    VALUES (?, ?, ?)
                `, [userId, postId, likeValue])
                .then(() => {
                    close(connection);
                    res.status(201).json();
                })
                .catch(error => {
                    close(connection);
                    handleError(res, "Like / dislike impossible.", 400, error);
                })
            }
            else {
                const prevLikeValue = rows[0].like_value;
                let newLikeValue;
                if(prevLikeValue === 0 || prevLikeValue === null) {
                    newLikeValue = likeValue;
                }
                else if (prevLikeValue === 1) {
                    newLikeValue = likeValue === 1 ? 0 : -1;
                }
                else {
                    newLikeValue = likeValue === 1 ? 1 : 0;
                }
                connection.execute(`
                    UPDATE likes
                    SET like_value = ?
                    WHERE user_id = ? AND post_id = ?
                `, [newLikeValue, userId, postId])
                .then(() => {
                    close(connection);
                    res.status(200).json();
                })
                .catch(error => {
                    close(connection);
                    handleError(res, "Like / dislike impossible.", 400, error);
                });
            }
        })
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    });
};

exports.getPostLikes = (req, res, next) => {
    const postId = req.params.id;

    connectToDb("getPostLikes")
    .then(connection => {
        connection.execute(`
        SELECT id, likes_count, dislikes_count
        FROM posts
        LEFT JOIN 
            (SELECT COUNT(*) AS likes_count, post_id
            FROM likes
            WHERE like_value = 1
            GROUP BY post_id) 
            AS likes_table
        ON posts.id = likes_table.post_id
        LEFT JOIN 
            (SELECT COUNT(*) AS dislikes_count, post_id
            FROM likes
            WHERE like_value = -1
            GROUP BY post_id)
            AS dislikes_table
        ON posts.id = dislikes_table.post_id
        WHERE id = ?
        ORDER BY created_at DESC;
        `, [postId])
        .then(([rows]) => {
            res.status(200).json({
                likesCount: rows[0].likes_count,
                dislikesCount: rows[0].dislikes_count
            })
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de récupérer les données (likes / dislikes).", 400, error);
        })
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
}

exports.getPostUserLike = (req, res, next) => {
    const postId = req.params.id;
    const userId = req.auth.userId;

    connectToDb("getPostUserLike")
    .then(connection => {
        connection.execute(`
            SELECT like_value 
            FROM likes
            WHERE user_id = ? AND post_id = ?
        `, [userId, postId])
        .then(([rows]) => {
            if(rows.length === 0) {
                res.status(200).json(0)
            }
            else res.status(200).json(rows[0].like_value)
        } )
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de récupérer les données (likes / dislikes).", 400, error);
        })
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
}

// exports.getAllComments = (req, res, next) => {
//     const userId = req.auth.userId;
//     const postId = req.params.id;

//     connectToDb("getAllComments")
//     .then(connection => {
//         connection.execute(`
//         SELECT comment_id, parent_id, comment_user_id, email, content, img_url, created_at, likes_count, dislikes_count, current_user_like_value
//         FROM 
//             (SELECT 
//                 posts.id AS comment_id, 
//                 posts.parent_id,
//                 posts.user_id AS comment_user_id, 
//                 users.email,
//                 posts.content, 
//                 posts.img_url, 
//                 posts.created_at, 
//                 users.id AS user_id
//             FROM posts
//             JOIN users
//             ON posts.user_id = users.id) 
//             AS posts_users
//             LEFT JOIN 
//                 (SELECT COUNT(*) AS likes_count, post_id
//                 FROM likes
//                 WHERE like_value = 1
//                 GROUP BY post_id) 
//                 AS likes_table
//             ON posts_users.comment_id = likes_table.post_id
//             LEFT JOIN 
//                 (SELECT COUNT(*) AS dislikes_count, post_id
//                 FROM likes
//                 WHERE like_value = -1
//                 GROUP BY post_id)
//                 AS dislikes_table
//             ON posts_users.comment_id = dislikes_table.post_id
//             LEFT JOIN
//             	(SELECT post_id, like_value AS current_user_like_value 
//             	FROM likes
//             	WHERE user_id = ?) AS user_likes_table
//             ON posts_users.comment_id = user_likes_table.post_id
//         WHERE parent_id = ?
//         ORDER BY created_at DESC
//         `, [userId, postId])
//         .then(([rows]) => {
//             const results = [];
            
//             for(let i = 0 ; i < rows.length ; i++) {
//                 results[i] =
//                     {
//                         commentId: rows[i].comment_id,
//                         commentUserId: rows[i].comment_user_id,
//                         email: rows[i].email,
//                         content: rows[i].content,
//                         imgUrl: rows[i].img_url,
//                         date: rows[i].created_at,
//                         likesCount: rows[i].likes_count,
//                         dislikesCount: rows[i].dislikes_count,
//                         currentUserLikeValue: rows[i].current_user_like_value
//                     };
//             };
//             close(connection);
//             return {
//                 comments: results, 
//                 admin: req.auth.admin === 1, 
//                 loggedUserId: req.auth.userId
//             };
//         })
//         .then(results => res.status(200).json(results))
//         .catch(error => {
//             close(connection);
//             handleError(res, "Impossible de récupérer les commentaires.", 400, error);
//         });
//     })
//     .catch(error => {
//         handleError(res, "Impossible de se connecter à la base de données.", 500, error);
//     });
// }

// exports.createComment = (req, res, next) => {
//     const userId = req.auth.userId;
//     const postId = req.params.id;

//     const createdAt = Date.now();
//     connectToDb("createComment")
//     .then(connection => {
//         if(!req.file && !req.body.content) {
//             handleError(res, "Le message ne peut pas être vide.", 400);
//         }
//         const imgUrl = 
//             req.file ? 
//             `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : 
//             "";
//         connection.execute(
//             `
//             INSERT INTO posts (parent_id, user_id, content, img_url, created_at)
//             VALUES (?, ?, ?, ?, ?)
//             `,
//             [postId, userId, content, imgUrl, createdAt]
//         )
//         .then(() => {
//             close(connection);
//             console.log("Commentaire ajouté à la base de données.");
//             res.status(201).json();
            
//         })
//         .catch(error => {
//             close(connection);
//             handleError(res, "Impossible de publier le commentaire.", 400, error);
//         }) 
//     })
//     .catch(error => {
//         handleError(res, "Impossible de se connecter à la base de données.", 500, error);
//     })
// }