import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    // Ensure correct cookie name
    const token = req.cookies.token; // Use 'token' if that's what you set in login

    if (!token) { 
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    // Verify token and extract payload
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ message: 'Token is not valid' });
        }   

        // Check if payload contains necessary fields
        // if (!payload || !payload.id) {
        //     return res.status(403).json({ message: 'Token payload is missing user ID' });
        // }

        req.userId = payload.id; // Extract user ID from the payload
        next(); // Proceed to the next middleware or route handler
    });
};
