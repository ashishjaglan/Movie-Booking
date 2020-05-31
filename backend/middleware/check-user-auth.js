const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'the_long_string_for_security_purpose_to_be_passed_here');
        req.userData = { email: decodedToken.email, userId: decodedToken.userId, userName: decodedToken.userName };
        next();
    }catch(error){
        res.status(401).json({ message: "You are not authenticated!" });
    }
};