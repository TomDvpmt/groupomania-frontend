const mysql = require("mysql2/promise");
const {Sequelize} = require("sequelize");

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

const db = {};

exports.db;

exports.initializeDbConnection = async () => {

    const { host, port, database, user, password} = dbConfig;
    

    try {
        const connection = await mysql.createConnection({host, port, user, password});
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        
        const sequelize = new Sequelize(
            database, 
            user, 
            password, 
            {
                dialect: "mysql",
                logging: false
            });
        
        await sequelize.authenticate();
        
        console.log("========== La connexion à la base de données a été établie. ==============");

        db.User = require("../models/User")(sequelize);
        db.User = require("../models/Post")(sequelize);
        db.User = require("../models/Like")(sequelize);
        await sequelize.sync({force: true});
        
    } catch(error) {
        console.error(`=========== Impossible de se connecter à la base de données : ${error} ================`);
    }
}