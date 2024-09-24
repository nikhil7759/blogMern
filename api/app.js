import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js"

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this is set in your .env file
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send("IT WORKS");
});

// Route handlers
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute)
app.use("/api/test", testRoute)


// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
