exports.likePost = (req, res, next) => {
    const postId = req.params.id;
    const userId = req.auth.userId;
    const likeValue = JSON.parse(req.body.likesData.likeValue);
    const likesCountDiff = JSON.parse(req.body.likesData.likesCountDiff);
    const dislikesCountDiff = JSON.parse(req.body.likesData.dislikesCountDiff);

    connectToDb("likePost")
        .then((connection) => {
            connection
                .execute(
                    `
                    SELECT id, post_user_id, likes_count, dislikes_count, current_user_like_value
                    FROM 
                        (SELECT 
                            posts.id, 
                            posts.user_id AS post_user_id, 
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
                    WHERE post_user_id = ? AND id = ? AND current_user_like_value IS NOT NULL
                `,
                    [userId, userId, postId]
                )
                .then(([rows]) => {
                    if (rows.length === 0) {
                        connection
                            .execute(
                                `
                                    INSERT INTO likes (user_id, post_id, like_value)
                                    VALUES (?, ?, ?)
                                `,
                                [userId, postId, likeValue]
                            )
                            .then(() => {
                                close(connection);
                                res.status(201).json({
                                    likesCount: likeValue === 1 ? 1 : 0,
                                    dislikesCount: likeValue === -1 ? 1 : 0,
                                    userLikeStatus: likeValue,
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
                    } else {
                        connection
                            .execute(
                                `
                                    UPDATE likes
                                    SET like_value = ?
                                    WHERE user_id = ? AND post_id = ?
                                `,
                                [likeValue, userId, postId]
                            )
                            .then(() => {
                                close(connection);
                                res.status(200).json({
                                    likesCount:
                                        rows[0].likesCount + likesCountDiff,
                                    dislikesCount:
                                        rows[0].dislikesCount +
                                        dislikesCountDiff,
                                    userLikeStatus: likeValue,
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
