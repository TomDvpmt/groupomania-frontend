const fs = require("fs");

const { connectToDb } = require("../database/db-connect-mysql");
const { close, handleError } = require("./utils");

/**
 * Get all the messages (posts or comments)
 * @param {Request} req
 * @param {Response} res
 * @param {Object} config
 */

exports.getAllMessages = (req, res, config) => {
    const { table, message, getAllLabel } = config;

    const userId = req.auth.userId;
    const parentId = parseInt(req.params.parentId);

    connectToDb(getAllLabel)
        .catch((error) => {
            handleError(
                res,
                "Impossible de se connecter à la base de données.",
                500,
                error
            );
        })
        .then((connection) => {
            connection
                .execute(
                    `
            SELECT 
                id, 
                parent_id,
                author_id,
                first_name,
                last_name,
                admin, 
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
                    ${table}.id, 
                    ${table}.parent_id,
                    ${table}.author_id, 
                    users.email,
                    users.first_name,
                    users.last_name,
                    users.admin,
                    ${table}.content, 
                    ${table}.img_url, 
                    ${table}.created_at,
                    ${table}.modified
                FROM ${table}
                JOIN users
                ON ${table}.author_id = users.id)
            AS ${table}_users
            LEFT JOIN 
                (SELECT COUNT(*) AS likes_count, ${message}_id
                FROM ${table}_likes
                WHERE like_value = 1
                GROUP BY ${message}_id) 
            AS likes_table
            ON ${table}_users.id = likes_table.${message}_id
            LEFT JOIN
                (SELECT COUNT(*) AS dislikes_count, ${message}_id
                FROM ${table}_likes
                WHERE like_value = -1
                GROUP BY ${message}_id )
            AS dislikes_table
            ON ${table}_users.id = dislikes_table.${message}_id
            LEFT JOIN
                (SELECT user_id, ${message}_id, like_value AS current_user_like_value
                FROM ${table}_likes
                WHERE user_id = ?) AS like_value_table
            ON ${table}_users.id = like_value_table.${message}_id
            WHERE parent_id = ?
            ORDER BY created_at DESC
            `,
                    [userId, parentId]
                )

                .then(([rows]) => {
                    const results = rows.map((row) => ({
                        id: row.id,
                        parentId: parentId,
                        authorId: row.author_id,
                        firstName: row.first_name ? row.first_name : "",
                        lastName: row.last_name ? row.last_name : "",
                        admin: row.admin,
                        email: row.email,
                        content: row.content,
                        imgUrl: row.img_url,
                        date: row.created_at,
                        modified: row.modified,
                        likes: row.likes_count,
                        dislikes: row.dislikes_count,
                        currentUserLikeValue: row.current_user_like_value,
                    }));
                    close(connection);
                    return {
                        results: results,
                        admin: req.auth.admin === 1,
                        loggedUserId: req.auth.userId,
                    };
                })
                .then((response) => res.status(200).json(response))
                .catch((error) => {
                    close(connection);
                    handleError(
                        res,
                        "Impossible de récupérer les données.",
                        400,
                        error
                    );
                });
        });
};

/**
 * Create a message (post or comment)
 * @param {Request} req
 * @param {Response} res
 * @param {Object} config
 */

exports.createMessage = (req, res, config) => {
    const { table, createLabel } = config;

    const userId = req.auth.userId;
    const content = req.body.content;
    const parentId = req.body.parentId;
    const createdAt = req.body.createdAt;
    const imgUrl = req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : "";
    if (!req.file && !req.body.content) {
        handleError(res, "Le message ne peut pas être vide.", 400);
    } else {
        connectToDb(createLabel)
            .catch((error) => {
                handleError(
                    res,
                    "Impossible de se connecter à la base de données.",
                    500,
                    error
                );
            })
            .then((connection) => {
                connection.execute(
                    `
                    INSERT INTO ${table} (parent_id, author_id, content, img_url, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [parentId, userId, content, imgUrl, createdAt]
                );
                close(connection);
            })
            .then(() => {
                console.log("Message ajouté à la base de données.");
                res.status(201).json({ imgUrl });
            })
            .catch((error) => {
                handleError(
                    res,
                    "Impossible de publier le message.",
                    400,
                    error
                );
                process.exit(1);
            });
    }
};

/**
 * Update a message (post or comment)
 * @param {Request} req
 * @param {Response} res
 * @param {Object} config
 */

exports.updateMessage = (req, res, config) => {
    const { table, updateLabel } = config;

    const messageId = req.params.id;
    const content = req.body.content;
    const prevImgUrl = req.body.imgUrl ? req.body.imgUrl : "";

    connectToDb(updateLabel)
        .then((connection) => {
            if (req.body.deleteImg) {
                console.log(
                    "messageId : ",
                    messageId,
                    "prevImgUrl :",
                    prevImgUrl
                );
                connection
                    .execute(
                        `
                            UPDATE ${table}
                            SET 
                                img_url = "",
                                modified = 1
                            WHERE id = ?
                        `,
                        [messageId]
                    )
                    .then(() => {
                        close(connection);
                        const formerFileName = prevImgUrl.split("/images/")[1];
                        prevImgUrl !== "" &&
                            fs.unlink(`images/${formerFileName}`, (error) => {
                                if (error)
                                    handleError(
                                        res,
                                        "Suppression du fichier impossible.",
                                        400,
                                        error
                                    );
                            });
                        console.log("Image supprimée.");
                        res.status(200).json({ message: "Image supprimée." });
                    })
                    .catch((error) => {
                        close(connection);
                        handleError(
                            res,
                            "Impossible de supprimer l'image.",
                            400,
                            error
                        );
                    });
            } else if (req.file) {
                const newImgUrl = `${req.protocol}://${req.get(
                    "host"
                )}/images/${req.file.filename}`;
                connection
                    .execute(
                        `UPDATE ${table}
                SET 
                    content = ?,
                    img_url = ?,
                    modified = 1
                WHERE id = ?`,
                        [content, newImgUrl, messageId]
                    )
                    .then(() => {
                        close(connection);
                        const formerFileName = prevImgUrl.split("/images/")[1];
                        prevImgUrl !== "" &&
                            fs.unlink(`images/${formerFileName}`, (error) => {
                                if (error)
                                    handleError(
                                        res,
                                        "Chargement du fichier impossible.",
                                        400,
                                        error
                                    );
                            });
                        console.log("Message mis à jour.");
                        res.status(200).json({
                            message: "Message mis à jour.",
                        });
                    })
                    .catch((error) => {
                        close(connection);
                        handleError(
                            res,
                            "Mise à jour du message impossible.",
                            400,
                            error
                        );
                    });
            } else {
                connection
                    .execute(
                        `UPDATE ${table}
                SET 
                    content = ?,
                    modified = 1
                WHERE id = ?`,
                        [content, messageId]
                    )
                    .then(() => {
                        close(connection);
                        console.log("Message mis à jour.");
                        res.status(200).json({
                            message: "Message mis à jour.",
                        });
                    })
                    .catch((error) => {
                        close(connection);
                        handleError(
                            res,
                            "Mise à jour du message impossible.",
                            400,
                            error
                        );
                    });
            }
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

/**
 * Delete a message (post or comment)
 * @param {Request} req
 * @param {Response} res
 * @param {Object} config
 */

exports.deleteMessage = (req, res, config) => {
    const { table, deleteLabel } = config;

    const messageId = req.params.id;
    const imgUrl = req.body.imgUrl;

    connectToDb(deleteLabel)
        .catch((error) =>
            handleError(
                res,
                "Impossible de se connecter à la base de données.",
                500,
                error
            )
        )
        .then((connection) => {
            connection.execute(
                `
            DELETE FROM ${table}
            WHERE id = ?
        `,
                [messageId]
            );
            close(connection);
        })
        .then(() => {
            if (imgUrl) {
                const fileName = imgUrl.split("/images/")[1];
                fs.unlink(`images/${fileName}`, (error) => {
                    if (error)
                        handleError(
                            res,
                            "Impossible de supprimer le fichier.",
                            400,
                            error
                        );
                });
            }
            res.status(200).json();
        })
        .catch((error) => {
            close(connection);
            handleError(res, "Impossible de supprimer le message.", 400, error);
        });
};

/**
 * Like a message (post or comment)
 * @param {Request} req
 * @param {Response} res
 * @param {Object} config
 */

exports.likeMessage = (req, res, config) => {
    const { table, message, likeLabel } = config;

    const messageId = req.params.id;
    const userId = req.auth.userId;
    const clickValue = JSON.parse(req.body.clickValue);

    connectToDb(likeLabel)
        .then((connection) => {
            connection
                .execute(
                    `
                    SELECT ${message}_id, user_id
                    FROM ${table}_likes
                    WHERE ${message}_id = ? AND user_id = ?
                    `,
                    [messageId, userId]
                )
                .then(([rows]) => {
                    if (rows.length === 0) {
                        connection
                            .execute(
                                `
                                    INSERT INTO ${table}_likes (user_id, ${message}_id, like_value)
                                    VALUES (?, ?, ?)
                                `,
                                [userId, messageId, clickValue]
                            )
                            .then(() => {
                                connection
                                    .execute(
                                        `
                                    SELECT 
                                        ${table}.id AS id,
                                        likes_count,
                                        dislikes_count
                                    FROM ${table}
                                    LEFT JOIN 
                                        (SELECT COUNT(*) AS likes_count, ${message}_id
                                        FROM ${table}_likes
                                        WHERE like_value = 1
                                        GROUP BY ${message}_id) 
                                        AS likes_table
                                    ON ${table}.id = likes_table.${message}_id
                                    LEFT JOIN 
                                        (SELECT COUNT(*) AS dislikes_count, ${message}_id
                                        FROM ${table}_likes
                                        WHERE like_value = -1
                                        GROUP BY ${message}_id)
                                        AS dislikes_table
                                    ON ${table}.id = dislikes_table.${message}_id
                                    WHERE id = ?
                                    `,
                                        [messageId]
                                    )
                                    .then(([rows]) => {
                                        const newLikesCount =
                                            rows[0].likes_count === null
                                                ? 0
                                                : rows[0].likes_count;
                                        const newDislikesCount =
                                            rows[0].dislikes_count === null
                                                ? 0
                                                : rows[0].dislikes_count;
                                        const dataToSend = {
                                            newLikesCount: newLikesCount,
                                            newDislikesCount: newDislikesCount,
                                            newUserLikeValue: clickValue,
                                        };
                                        close(connection);
                                        res.status(201).json(dataToSend);
                                    })
                                    .catch((error) => {
                                        close(connection);
                                        handleError(
                                            res,
                                            "Création du like / dislike impossible (2).",
                                            400,
                                            error
                                        );
                                    });
                            })
                            .catch((error) => {
                                close(connection);
                                handleError(
                                    res,
                                    "Création du like / dislike impossible (1).",
                                    400,
                                    error
                                );
                            });
                    } else {
                        connection
                            .execute(
                                `
                            SELECT 
                                ${table}.id AS id,
                                likes_count,
                                dislikes_count,
                                current_user_like_value
                            FROM ${table}
                            LEFT JOIN 
                                (SELECT COUNT(*) AS likes_count, ${message}_id
                                FROM ${table}_likes
                                WHERE like_value = 1
                                GROUP BY ${message}_id) 
                                AS likes_table
                            ON ${table}.id = likes_table.${message}_id
                            LEFT JOIN 
                                (SELECT COUNT(*) AS dislikes_count, ${message}_id
                                FROM ${table}_likes
                                WHERE like_value = -1
                                GROUP BY ${message}_id)
                                AS dislikes_table
                            ON ${table}.id = dislikes_table.${message}_id
                            LEFT JOIN 
                                (SELECT ${message}_id, like_value AS current_user_like_value 
                                FROM ${table}_likes
                                WHERE user_id = ?) AS user_likes_table
                            ON ${table}.id = user_likes_table.${message}_id
                            WHERE id = ?
                            
                            `,
                                [userId, messageId]
                            )
                            .then(([rows]) => {
                                const prevLikeValue =
                                    rows[0].current_user_like_value;
                                const prevLikesCount = rows[0].likes_count;
                                const prevDislikesCount =
                                    rows[0].dislikes_count;

                                let newLikeValue = 0;
                                let likesCount =
                                    prevLikesCount === null
                                        ? 0
                                        : prevLikesCount;
                                let dislikesCount =
                                    prevDislikesCount === null
                                        ? 0
                                        : prevDislikesCount;

                                if (prevLikeValue === 0) {
                                    newLikeValue = clickValue;
                                    likesCount =
                                        clickValue === 1
                                            ? likesCount + 1
                                            : likesCount;
                                    dislikesCount =
                                        clickValue === 1
                                            ? dislikesCount
                                            : dislikesCount - 1;
                                } else if (prevLikeValue === clickValue) {
                                    newLikeValue = 0;
                                    likesCount =
                                        clickValue === 1
                                            ? likesCount - 1
                                            : likesCount;
                                    dislikesCount =
                                        clickValue === 1
                                            ? dislikesCount
                                            : dislikesCount - 1;
                                } else if (
                                    prevLikeValue === 1 &&
                                    clickValue === -1
                                ) {
                                    newLikeValue = -1;
                                    likesCount = likesCount - 1;
                                    dislikesCount = dislikesCount + 1;
                                } else if (
                                    prevLikeValue === -1 &&
                                    clickValue === 1
                                ) {
                                    newLikeValue = 1;
                                    likesCount = likesCount + 1;
                                    dislikesCount = dislikesCount - 1;
                                }

                                if (newLikeValue === 0) {
                                    connection
                                        .execute(
                                            `
                                    DELETE FROM ${table}_likes
                                    WHERE user_id = ? AND ${message}_id = ?
                                `,
                                            [userId, messageId]
                                        )
                                        .then(() => {
                                            console.log(
                                                "Like /dislike supprimé"
                                            );
                                            const dataToSend = {
                                                newLikesCount: likesCount,
                                                newDislikesCount: dislikesCount,
                                                newUserLikeValue: 0,
                                            };
                                            close(connection);
                                            res.status(200).json(dataToSend);
                                        })
                                        .catch((error) => {
                                            close(connection);
                                            handleError(
                                                res,
                                                "Impossible de supprimer le like/dislike.",
                                                400,
                                                error
                                            );
                                        });
                                } else {
                                    connection
                                        .execute(
                                            `
                                        UPDATE ${table}_likes
                                        SET like_value = ?
                                        WHERE user_id = ? AND ${message}_id = ?
                                    `,
                                            [newLikeValue, userId, messageId]
                                        )
                                        .then(() => {
                                            close(connection);
                                            res.status(200).json({
                                                newUserLikeValue: newLikeValue,
                                                newLikesCount: likesCount,
                                                newDislikesCount: dislikesCount,
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
