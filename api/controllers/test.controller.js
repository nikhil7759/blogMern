import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const normalUser = async (req, res) => {
    
    console.log(req.userId)
    // Token is valid, send success response
    res.status(200).json({ message: "You are authenticated" });
};



export const adminUser = async (req, res) => {
    const token = req.cookies.token;  // Ensure correct cookie name
  

    if (!token) {
        return res.status(401).json({ message: "Not Authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Token is not Valid" });
        }
        if (!payload.isAdmin){
            return res.status(403).json({ message: "Not Authorized" });
        }

        
    });
    // Token is valid, send success response
    res.status(200).json({ message: "You are authenticated" });
};
