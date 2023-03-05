const Post = () => {
    return (
        <article className="post">
            <p className="post__user-address">mockadress@test.com</p>
            <div className="post__content">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/NZ_Landscape_from_the_van.jpg/800px-NZ_Landscape_from_the_van.jpg"
                    alt="post illustration"
                />
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quasi ipsa necessitatibus inventore eaque laboriosam
                    reprehenderit nihil voluptatem, tenetur ea? Ut quas, quos
                    voluptatum laboriosam earum qui minima. Sunt, modi quo
                    officia molestias ut pariatur? Veniam ut, saepe excepturi
                    reprehenderit, ea non expedita ipsam perspiciatis totam
                    voluptatum, obcaecati similique atque magni.
                </p>
            </div>
        </article>
    );
};

export default Post;
