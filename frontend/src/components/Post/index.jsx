import React from "react";

const Post = ({
    postUserId,
    email,
    content,
    imgUrl,
    date,
    admin,
    loggedUserId,
}) => {
    const rawDate = new Date(date);
    const hours =
        rawDate.getHours() < 10 ? `0${rawDate.getHours()}` : rawDate.getHours();
    const minutes =
        rawDate.getMinutes() < 10
            ? `0${rawDate.getMinutes()}`
            : rawDate.getMinutes();
    const formatedDate = `Le ${rawDate.toLocaleDateString()} à ${hours}:${minutes}`;

    return (
        <article className="post">
            <h3 className="post__user-address">
                {email} | {formatedDate}
            </h3>
            <div className="post__content">
                <img src={imgUrl} alt="post illustration" />
                <p>{content}</p>
            </div>
            <div className="post__buttons">
                {(admin || postUserId === loggedUserId) && (
                    <React.Fragment>
                        <button>Modifier</button>
                        <button>Supprimer</button>
                    </React.Fragment>
                )}
            </div>
        </article>
    );
};

export default Post;
