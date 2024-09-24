import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid username" });
        }

        // Check the password
        const ispasswordValid = await bcrypt.compare(password, user.password);

        if (!ispasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate a token and set cookies
        const age = 1000 * 60 * 60 * 24 * 6;
        
        const token = jwt.sign(
            { id: user.id,
              isAdmin: true, 
            
             },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        const { password: userPassword, ...userInfo } = user;

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json(userInfo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    // Clear cookie
    res.clearCookie("token").status(200).json("LOGOUT SUCCESSFUL");
};
