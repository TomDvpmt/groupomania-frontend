const jwt = require("jsonwebtoken");

/** Checks if the user is authorized (= has a jwt token created by the app) for the current request
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_CREATION_PHRASE);
        const userId = decodedToken.userId;
        const admin = decodedToken.admin;
        req.auth = {userId: userId, admin: admin};
        next();
    } catch(error) {
        res.status(401).json({message: "Non autorisé."})
    }
}