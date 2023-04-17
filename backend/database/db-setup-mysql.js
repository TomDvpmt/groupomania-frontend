const mysql = require("mysql2/promise");
const { connectToDb } = require("./db-connect-mysql");

/** Checks if the database exists
 *
 * @param {import("mysql2/promise").Connection} connection
 * @param {String} dbName
 * @returns {Boolean}
 */

const databaseExists = async (connection, dbName) => {
    try {
        const [rows] = await connection.execute(
            `
                SELECT SCHEMA_NAME
                FROM INFORMATION_SCHEMA.SCHEMATA
                WHERE SCHEMA_NAME = '${dbName}'
            `
        );
        return rows[0].SCHEMA_NAME === dbName;
    } catch (error) {
        console.log(error);
    }
};

/** Initializes the database (creates it if it doesn't exist, then connects to it)
 *
 * @param {String} dbName
 * @returns {import("mysql2/promise").Connection}
 */

const initializeDb = async (dbName) => {
    try {
        const firstConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        const groupomaniaDbExists = await databaseExists(
            firstConnection,
            dbName
        );

        if (!groupomaniaDbExists) {
            await firstConnection.execute(
                `CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`
            );
            console.log(
                `========= Base de données "${dbName}" créée. =========`
            );
        }

        const connection = await connectToDb("initialisation");
        return connection;
    } catch (error) {
        console.error(
            "========= Connexion à la base de données échouée: ",
            error
        );
    }
};

/** Checks if a table exists in the database
 *
 * @param {import("mysql2/promise").Connection} connection
 * @param {String} dbName
 * @param {String} tableName
 * @returns {Boolean}
 */

const tableExists = async (connection, dbName, tableName) => {
    try {
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
        );
        return rows[0].count === 1;
    } catch (error) {
        console.log(error);
    }
};

/** Sets up the database's tables (including triggers)
 *
 * @param {import("mysql2/promise").Connection} connection
 * @param {String} dbName
 */

const setupDbTables = async (connection, dbName) => {
    const usersExists = await tableExists(connection, dbName, "users");
    const postsExists = await tableExists(connection, dbName, "posts");
    const chatPostsExists = await tableExists(connection, dbName, "chat_posts");
    const likesExists = await tableExists(connection, dbName, "likes");

    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(500) NOT NULL,
            admin BOOLEAN DEFAULT 0
        )
    `);
    !usersExists && console.log(`========= Table "users" créée. =========`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parent_id INT DEFAULT 0,
            author_id INT NOT NULL,
            content VARCHAR(5000),
            img_url VARCHAR(500),
            created_at BIGINT NOT NULL,
            modified BOOLEAN DEFAULT 0,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    `);
    !postsExists && console.log(`========= Table "posts" créée. =========`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS chat_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            author_id INT NOT NULL,
            content VARCHAR(5000),
            img_url VARCHAR(500),
            moderated BOOLEAN DEFAULT 0,
            created_at BIGINT NOT NULL,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    `);
    !chatPostsExists &&
        console.log(`========= Table "chat_posts" créée. =========`);

    await connection.query(`
        CREATE TABLE IF NOT EXISTS likes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            post_id INT,
            like_value INT NOT NULL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (post_id) REFERENCES posts(id)
        )
    `);
    !likesExists && console.log(`========= Table "likes" créée. =========`);

    await connection.query(`
        CREATE TRIGGER IF NOT EXISTS posts_before_delete
        BEFORE DELETE ON posts
        FOR EACH ROW
        DELETE FROM likes
        WHERE post_id = OLD.id
    `);

    await connection.query(`
        CREATE TRIGGER IF NOT EXISTS users_likes_before_delete
        BEFORE DELETE ON users
        FOR EACH ROW
        DELETE FROM likes
        WHERE user_id = OLD.id
    `);

    await connection.query(`
        CREATE TRIGGER IF NOT EXISTS users_posts_before_delete
        BEFORE DELETE ON users
        FOR EACH ROW
        DELETE FROM posts
        WHERE author_id = OLD.id
    `);

    await connection.query(`
        CREATE TRIGGER IF NOT EXISTS users_chat_posts_before_delete
        BEFORE DELETE ON users
        FOR EACH ROW
        DELETE FROM chat_posts
        WHERE author_id = OLD.id
    `);

    console.log("========= Tables vérifiées. =========== ");
};

/** Sets up the database (initialization + tables setup)
 */

const dbSetUp = async () => {
    const dbName = process.env.DB_NAME;
    const connection = await initializeDb(dbName);
    await setupDbTables(connection, dbName);
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

module.exports = dbSetUp;
