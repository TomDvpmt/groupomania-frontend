const fs = require("fs");

const { connectToDb } = require("../database/db-connect-mysql");
const { close } = require("../utils/utils");
const { handleError } = require("../utils/utils");

const limit = process.env.CHAT_POSTS_LIMIT;

/**
 * Get all the chat posts
 *
 * @param {Request} req
 * @param {Response} res
 *
 */

exports.getAllPosts = (req, res) => {
    connectToDb("getAllPosts (chat)")
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
                        SELECT *
                        FROM (
                            SELECT
                                posts.id as id,
                                users.id as author_id,
                                users.first_name as first_name,
                                users.last_name as last_name,
                                users.admin as admin,
                                posts.content as content,
                                posts.img_url as img_url,
                                posts.moderation as moderation,
                                posts.alert as alert,
                                posts.created_at as created_at
                            FROM chat_posts as posts
                            JOIN users
                            ON users.id = posts.author_id
                            ORDER BY created_at DESC
                            LIMIT ${limit}
                        ) results
                        ORDER BY created_at ASC
                    `
                )
                .then(([rows]) => {
                    const results = rows.map((row) => ({
                        authorIsAdmin: row.admin,
                        authorId: row.author_id,
                        firstName: row.first_name ? row.first_name : "",
                        lastName: row.last_name ? row.last_name : "",
                        content: row.content,
                        imgUrl: row.img_url,
                        moderation: row.moderation,
                        alert: row.alert,
                        createdAt: row.created_at,
                    }));
                    close(connection);
                    return results;
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

exports.createPost = (req, res) => {
    const userId = req.auth.userId;
    const content = req.body.content;
    const createdAt = req.body.createdAt;
    const imgUrl = req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : "";

    connectToDb("createPost (chat)")
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
            INSERT INTO chat_posts (author_id, content, img_url, created_at)
            VALUES (?, ?, ?, ?)
            `,
                [userId, content, imgUrl, createdAt]
            );
            close(connection);
        })
        .then(() => {
            console.log("Message ajouté à la base de données.");
            res.status(201).json({ imgUrl });
        })
        .catch((error) => {
            close(connection);
            handleError(res, "Impossible de publier le message.", 400, error);
        });
};

exports.updatePost = (req, res) => {
    const index = req.body.index;
    const property = req.body.property;
    const updatedValue = req.body.updatedValue;

    connectToDb("updatePost (chat)")
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
                        SELECT id, created_at
                        FROM chat_posts
                        ORDER BY created_at ASC
                    `
                )
                .then(([rows]) => {
                    const postId = rows[index].id;
                    connection.execute(
                        `
                            UPDATE chat_posts
                            SET ${property} = ?
                            WHERE id = ?
                        `,
                        [updatedValue, postId]
                    );
                })
                .then(() => {
                    close(connection);
                    res.status(200).json({ message: "Message mis à jour." });
                })
                .catch((error) => {
                    close(connection);
                    handleError(
                        res,
                        "Impossible de mettre à jour le message.",
                        400,
                        error
                    );
                });
        });
};

exports.deleteOldestPost = (req, res) => {
    const imgUrl = req.body.imgUrl;

    connectToDb("deletePost")
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
                // delete oldest post
                ``,
                []
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
