const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({ message: 'A token is required for authorization' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        console.log(err)
        return res.status(401).send({ message: 'Invalid Token' });
    }
    return next();
};

/**
 * export
 */
module.exports = verifyToken;