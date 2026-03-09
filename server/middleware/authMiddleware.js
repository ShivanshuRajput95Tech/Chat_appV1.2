const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWTPRIVATEKEY
        );

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({ message: "Invalid token" });

    }

};

module.exports = authMiddleware;