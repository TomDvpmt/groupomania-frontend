/** Closes connection to database
 * 
 * @param {import("mysql2/promise").Connection} connection
 */

exports.close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};



/** Handles error : sets res.status and the error message, and logs the error
 * 
 * @param {Response} res
 * @param {String} message 
 * @param {Number} status 
 * @param {Error} error
 */

exports.handleError = (res, message, status, error) => {
    console.log(message, error);
    return res.status(status).json({message: message});
}