import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;

export const Authenticate = (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization;

        if(!tokenHeader) {
            return res.status(401).json({ message: "Token not procided. Please log in" });
        }

        const token = tokenHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        req.userId = decoded.userId;    
        req.userEmail = decoded.email; 
        next();

    } catch (error) {
        res.status(500).json({ message: "Authentication error", error: error.message})
    }
}

export const generateToken = (userId, email) => {
    return jwt.sign(
        {
        userId, email
        }, 
        SECRET_KEY,
        {
            expiresIn: "7d"
        }
    );
}