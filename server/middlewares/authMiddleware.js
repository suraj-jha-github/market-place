const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // Check if authorization header exists
        const authHeader = req.header("authorization");
        if (!authHeader) {
            return res.status(401).send({
                success: false,
                message: "Authentication failed. Please login again."
            });
        }
        
        // get the token from header
        const token = authHeader.split(" ")[1];
        const decryptedToken = jwt.verify(token, process.env.jwt_secret);
        req.body.userId = decryptedToken.userId;
        next();
        
    } catch (error) {
        // Return 401 status for JWT errors
        res.status(401).send({
            success: false,
            message: "Authentication failed. Please login again."
        });
    }
}