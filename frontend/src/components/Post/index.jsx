const Post = (props) => {
    return (
        <article className="post">
            <h3 className="post__user-address">
                {props.userEmail} | {props.date}
            </h3>
            <div className="post__content">
                <img src={props.imgUrl} alt="post illustration" />
                <p>{props.content}</p>
            </div>
            <div className="post__buttons">
                <button>Modifier</button>
                <button>Supprimer</button>
            </div>
        </article>
    );
};

export default Post;
