const mysql = require("mysql2/promise");
const connectToDb = require("./db-connect-mysql");

const databaseExists = async(connection, dbName) => {
    try{
        const [rows] = await connection.execute(
            `
                SELECT SCHEMA_NAME
                FROM INFORMATION_SCHEMA.SCHEMATA
                WHERE SCHEMA_NAME = '${dbName}'
            `
        );
        return rows[0].SCHEMA_NAME === dbName;
    } catch(error) {
        console.log(error);
    }
}

const initializeDb = async (dbName) => {
    try{
        const firtsConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        const groupomaniaDbExists = await databaseExists(firtsConnection, dbName);

        if(!groupomaniaDbExists) {
            await firtsConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
            console.log(`========= Base de données "${dbName}" créée. =========`);
        }

        const connection = await connectToDb();
        return connection;

    } catch(error) {
        console.error("========= Connexion à la base de données échouée: ", error);
    }
};

const tableExists = async (connection, dbName, tableName) => {
    try{
        const [rows] = await connection.execute(
            `
            SELECT COUNT(TABLE_NAME) AS count
            FROM 
               information_schema.TABLES 
            WHERE 
               TABLE_SCHEMA LIKE '${dbName}' AND 
                TABLE_TYPE LIKE 'BASE TABLE' AND
                TABLE_NAME = '${tableName}'
            `
        )
        return rows[0].count === 1;
    } catch(error) {
        console.log(error);
    }
};

const setupDbTables = async (connection, dbName) => {

    const usersExists = await tableExists(connection, dbName, "users");
    const postsExists = await tableExists(connection, dbName, "posts");
    const likesExists = await tableExists(connection, dbName, "likes");
    
    if(!usersExists) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                passwordHash VARCHAR(500) NOT NULL
            )
        `);
        console.log(`========= Table "users" créée. =========`);
    } ;   
        
    if(!postsExists) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content VARCHAR(5000) NOT NULL,
                img_url VARCHAR(500) NOT NULL
            )
        `);
        console.log(`========= Table "posts" créée. =========`);
    };
    
    if(!likesExists) {
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS likes (
                user_id INT NOT NULL PRIMARY KEY,
                post_id INT NOT NULL,
                like_type CHAR(255)
            )
        `);
        console.log(`========= Table "likes" créée. =========`);
    };

    console.log("========= Tables vérifiées. =========== ");
};

const dbSetUp = async () => {
    const dbName = process.env.DB_NAME;
    const connection = await initializeDb(dbName);
    await setupDbTables(connection, dbName);
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

module.exports = dbSetUp;

