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

    connectToDb("getAllPosts" + parentId === 0 ? "posts" : "comments")
    .then(connection => {
        connection.execute(`
        SELECT 
            id, 
            parent_id,
            author_id, 
            email, 
            content, 
            img_url, 
            created_at, 
            modified,
            IFNULL(likes_count, 0) AS likes_count,
            IFNULL(dislikes_count, 0) AS dislikes_count,
            IFNULL(current_user_like_value, 0) AS current_user_like_value
        FROM
            (SELECT 
                posts.id, 
                posts.parent_id,
                posts.author_id, 
                users.email,
                posts.content, 
                posts.img_url, 
                posts.created_at,
                posts.modified
            FROM posts
            JOIN users
            ON posts.author_id = users.id)
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
            GROUP BY post_id )
        AS dislikes_table
        ON posts_users.id = dislikes_table.post_id
        LEFT JOIN
            (SELECT user_id, post_id, like_value AS current_user_like_value
            FROM likes
            WHERE user_id = ?) AS like_value_table
        ON posts_users.id = like_value_table.post_id
        WHERE parent_id = ?
        ORDER BY created_at DESC
            `, [userId, parentId])
        .then(([rows]) => {
            const results = [];
            
            for(let i = 0 ; i < rows.length ; i++) {
                results[i] = 
                    {
                        id: rows[i].id,
                        parentId: rows[0].parent_id,
                        postAuthorId: rows[i].author_id,
                        email: rows[i].email,
                        content: rows[i].content,
                        imgUrl: rows[i].img_url,
                        date: rows[i].created_at,
                        modified: rows[i].modified,
                        likes: rows[i].likes_count,
                        dislikes: rows[i].dislikes_count,
                        currentUserLikeValue: rows[i].current_user_like_value
                    }
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
            INSERT INTO posts (parent_id, author_id, content, img_url, created_at)
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
                WHERE id = ? OR parent_id = ?
            `, [postId, postId])
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
    const clickValue = JSON.parse(req.body.clickValue);

    connectToDb("likePost")
        .then((connection) => {
            connection
                .execute(
                    `
                    SELECT post_id, user_id
                    FROM likes
                    WHERE post_id = ? AND user_id = ?
                    `, [postId, userId]
                )
                .then(([rows]) => {
                    if (rows.length === 0) {
                        console.log("CAS : rows.length === 0")
                        connection
                            .execute(
                                `
                                    INSERT INTO likes (user_id, post_id, like_value)
                                    VALUES (?, ?, ?)
                                `,
                                [userId, postId, clickValue]
                            )
                            .then(() => {
                                connection.execute(
                                    `
                                    SELECT 
                                        posts.id AS id,
                                        likes_count,
                                        dislikes_count
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
                                    `, [postId]
                                )
                                .then(([rows]) => {
                                    console.log("rows : ", rows)
                                    const newLikesCount = rows[0].likes_count === null ? 0 : rows[0].likes_count;
                                    const newDislikesCount = rows[0].dislikes_count === null ? 0 : rows[0].dislikes_count;
                                    const dataToSend = {
                                        newLikesCount: newLikesCount,
                                        newDislikesCount: newDislikesCount,
                                        newUserLikeValue: clickValue,
                                    }
                                    console.log("dataToSend : ", dataToSend);
                                    close(connection);
                                    res.status(201).json(dataToSend);
                                })
                                .catch(error => {
                                    close(connection);
                                    handleError(res, "Like / dislike impossible (1).", 400, error)
                                })
                            })
                            .catch((error) => {
                                close(connection);
                                handleError(
                                    res,
                                    "Like / dislike impossible (2).",
                                    400,
                                    error
                                );
                            });
                    } else {
                        console.log("CAS : rows.length > 0")
                        console.log("userId : ", userId, "postId : ", postId)
                        connection.execute(
                            `
                            SELECT 
                                posts.id AS id,
                                likes_count,
                                dislikes_count,
                                current_user_like_value
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
                            LEFT JOIN 
                                (SELECT post_id, like_value AS current_user_like_value 
                                FROM likes
                                WHERE user_id = ?) AS user_likes_table
                            ON posts.id = user_likes_table.post_id
                            WHERE id = ?
                            
                            `, [userId, postId]
                        )
                        .then(([rows]) => {
                            console.log("rows : ", rows)
                            const prevLikeValue = rows[0].current_user_like_value;
                            const prevLikesCount = rows[0].likes_count;
                            const prevDislikesCount = rows[0].dislikes_count;

                            let newLikeValue = 0;
                            let likesCount = prevLikesCount === null ? 0 : prevLikesCount;
                            let dislikesCount = prevDislikesCount === null ? 0 : prevDislikesCount;

                            console.log("prevLikeValue : ", prevLikeValue);
                            console.log("likesCount : ", likesCount);
                            console.log("dislikesCount : ", dislikesCount);

                            if(prevLikeValue === 0) {
                                newLikeValue = clickValue;
                                likesCount = clickValue === 1 ? likesCount + 1 : likesCount;
                                dislikesCount = clickValue === 1 ? dislikesCount : dislikesCount - 1;
                            }
                            else if(prevLikeValue === clickValue) {
                                newLikeValue = 0
                                likesCount = clickValue === 1 ? likesCount - 1 : likesCount;
                                dislikesCount = clickValue === 1 ? dislikesCount : dislikesCount - 1;
                            }
                            else if(prevLikeValue === 1 && clickValue === -1) {
                                newLikeValue = -1;
                                likesCount = likesCount - 1;
                                dislikesCount = dislikesCount + 1;
                            }
                            else if(prevLikeValue === -1 && clickValue === 1) {
                                newLikeValue = 1;
                                likesCount = likesCount + 1;
                                dislikesCount = dislikesCount - 1;
                            }

                            console.log("newLikeValue :", newLikeValue, "newLikesCount : ", likesCount, "newDislikesCount : ", dislikesCount)

                            if(newLikeValue === 0 ) {
                                connection.execute(`
                                    DELETE FROM likes
                                    WHERE user_id = ? AND post_id = ?
                                `, [userId, postId])
                                .then(() => {
                                    console.log("Like /dislike supprimé")
                                    const dataToSend = {
                                        newLikesCount: likesCount,
                                        newDislikesCount: dislikesCount,
                                        newUserLikeValue: 0,
                                    }
                                    console.log("dataToSend after delete : ", dataToSend);
                                    close(connection);
                                    res.status(200).json(dataToSend);
                                })
                                .catch(error => {
                                    close(connection);
                                    handleError(res, "Impossible de supprimer le like/dislike.", 400, error)
                                })
                            }
                            else {
                                connection
                                .execute(
                                    `
                                        UPDATE likes
                                        SET like_value = ?
                                        WHERE user_id = ? AND post_id = ?
                                    `,
                                    [newLikeValue, userId, postId]
                                )
                                .then(() => {
                                    close(connection);
                                    res.status(200).json({
                                        newUserLikeValue: newLikeValue,
                                        newLikesCount: likesCount,
                                        newDislikesCount: dislikesCount
                                    });
                                })
                                .catch((error) => {
                                    close(connection);
                                    handleError(
                                        res,
                                        "Like / dislike impossible.",
                                        400,
                                        error
                                    );
                                });
                            }
                        })
                        .catch(error => {
                            close(connection);
                            handleError(res, "Like / dislike impossible.", 400, error)
                        });
                    }
                });
        })
        .catch((error) => {
            handleError(
                res,
                "Impossible de se connecter à la base de données.",
                500,
                error
            );
        });
};


// exports.getPostLikes = (req, res, next) => {
//     const postId = req.params.id;

//     connectToDb("getPostLikes")
//     .then(connection => {
//         connection.execute(`
//         SELECT id, likes_count, dislikes_count
//         FROM posts
//         LEFT JOIN 
//             (SELECT COUNT(*) AS likes_count, post_id
//             FROM likes
//             WHERE like_value = 1
//             GROUP BY post_id) 
//             AS likes_table
//         ON posts.id = likes_table.post_id
//         LEFT JOIN 
//             (SELECT COUNT(*) AS dislikes_count, post_id
//             FROM likes
//             WHERE like_value = -1
//             GROUP BY post_id)
//             AS dislikes_table
//         ON posts.id = dislikes_table.post_id
//         WHERE id = ?
//         ORDER BY created_at DESC;
//         `, [postId])
//         .then(([rows]) => {
//             res.status(200).json({
//                 likesCount: rows[0].likes_count,
//                 dislikesCount: rows[0].dislikes_count
//             })
//         })
//         .catch(error => {
//             close(connection);
//             handleError(res, "Impossible de récupérer les données (likes / dislikes).", 400, error);
//         })
//     })
//     .catch(error => {
//         handleError(res, "Impossible de se connecter à la base de données.", 500, error);
//     })
// }

// exports.getPostUserLike = (req, res, next) => {
//     const postId = req.params.id;
//     const userId = req.auth.userId;

//     connectToDb("getPostUserLike")
//     .then(connection => {
//         connection.execute(`
//             SELECT like_value 
//             FROM likes
//             WHERE user_id = ? AND post_id = ?
//         `, [userId, postId])
//         .then(([rows]) => {
//             if(rows.length === 0) {
//                 res.status(200).json(0)
//             }
//             else res.status(200).json(rows[0].like_value)
//         } )
//         .catch(error => {
//             close(connection);
//             handleError(res, "Impossible de récupérer les données (likes / dislikes).", 400, error);
//         })
//     })
//     .catch(error => {
//         handleError(res, "Impossible de se connecter à la base de données.", 500, error);
//     })
// }

// exports.getAllComments = (req, res, next) => {
//     const userId = req.auth.userId;
//     const postId = req.params.id;

//     connectToDb("getAllComments")
//     .then(connection => {
//         connection.execute(`
//         SELECT comment_id, parent_id, comment_author_id, email, content, img_url, created_at, likes_count, dislikes_count
//         FROM 
//             (SELECT 
//                 posts.id AS comment_id, 
//                 posts.parent_id,
//                 posts.author_id AS comment_author_id, 
//                 users.email,
//                 posts.content, 
//                 posts.img_url, 
//                 posts.created_at, 
//                 users.id AS user_id
//             FROM posts
//             JOIN users
//             ON posts.author_id = users.id) 
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
//         WHERE parent_id = ?
//         ORDER BY created_at DESC
//         `, [postId])
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