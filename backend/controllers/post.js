exports.getAllPosts = (req, res, next) => {
    const mockPosts = [
        {
            "id": "1",
            "userEmail": "mock_email@test.com",
            "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Le_paysage_de_la_RN1.jpg/640px-Le_paysage_de_la_RN1.jpg",
            "content": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
            "date": `${new Date(1679055892915)}`
        },

        {
            "id": "2",
            "userEmail": "mock_email2@test.com",
            "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Paysage_Co%C3%ABvrons.JPG/640px-Paysage_Co%C3%ABvrons.JPG",
            "content": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
            "date": `${new Date(1678058892935)}`
        }
    ]
    return res.status(200).json(mockPosts);
};

exports.getOnePost = (req, res, next) => {
    
};

exports.createPost = (req, res, next) => {

};

// if admin
exports.updatePost = (req, res, next) => {

};

// if admin
exports.deletePost = (req, res, next) => {

};

exports.likePost = (req, res, next) => {

};