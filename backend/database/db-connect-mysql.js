const mysql = require("mysql2/promise");


/** Connects the application to the database
 * 
 * @param {String} message 
 * @returns {import("mysql2/promise").Connection}
 */

exports.connectToDb = async (message) => {
    try{
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log(`========= Connexion à la base de données (${message}) =========`);
        return connection;
    }
    catch(error) {
        console.error("========= Connexion à la base de données échouée: ", error);
    }
}