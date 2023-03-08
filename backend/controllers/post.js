const connectToDb = require("../database/db-connect-mysql");

exports.getAllPosts = (req, res, next) => {
    // const mockPosts = [
    //     {
    //         "id": "1",
    //         "userEmail": "mock_email@test.com",
    //         "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Le_paysage_de_la_RN1.jpg/640px-Le_paysage_de_la_RN1.jpg",
    //         "content": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    //         "date": `${new Date(1679055892915)}`
    //     },

    //     {
    //         "id": "2",
    //         "userEmail": "mock_email2@test.com",
    //         "imgUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Paysage_Co%C3%ABvrons.JPG/640px-Paysage_Co%C3%ABvrons.JPG",
    //         "content": "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
    //         "date": `${new Date(1678058892935)}`
    //     }
    // ];
    // return res.status(200).json(mockPosts);
    connectToDb()
    .then(connection => {
        connection.execute(
            `
                SELECT id, user_id, content, img_url, created_at 
                FROM posts
                ORDER BY created_at DESC
            `, [])
            .then(([rows]) => {
                const results = [];
                for(let i = 0 ; i < rows.length ; i++) {
                    results[i] = 
                        {
                            id: rows[i].id,
                            //userId: rows[i].user_id,
                            content: rows[i].content,
                            imgUrl: rows[i].img_url,
                            date: rows[i].created_at
                        };
                }
                return results;
            })
            .then((results) => {
                res.status(200).json(results);
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