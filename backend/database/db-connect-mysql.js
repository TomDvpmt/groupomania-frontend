const mysql = require("mysql2/promise");

const connectToDb = async () => {
    try{
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log("========= Connexion à la base de données réussie. =========");
        return connection;
    }
    catch(error) {
        console.error("========= Connexion à la base de données échouée: ", error);
    }
}

module.exports = connectToDb;