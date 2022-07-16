const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authentication;

    if (!token) {
        return res.status(403).send({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send({ message: 'Invalid Token' });
    }
    return next();
};

module.exports = verifyToken;