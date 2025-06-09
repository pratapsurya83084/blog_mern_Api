import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import PostRoute from './routes/post.route.js';
import CommentRouter from "./routes/comment.route.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
// Load .env variables
dotenv.config(); // This assumes .env is in the same directory

const app = express();


app.use(cors({
//  origin:"http://localhost:5173",
 origin:"https://pratapblogs.netlify.app",

credentials: true,  
}))

const port = process.env.PORT || 4000;

const dbUrl = process.env.DB_CONNECTION_URL;
// console.log("DB URL:", dbUrl); // Check if it prints correctly
// app.use('/images', express.static('public/images'));

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("The server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Connect to DB
async function dbConnect() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ DB Connected Successfully...............");
  } catch (error) {
    console.error("❌ DB Connection Error:", error);
  }
}

dbConnect();

// All Route here
app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);
app.use("/api/Comment", CommentRouter);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";
//   res.status(statusCode).json({ success: false, statusCode, message });
// });
