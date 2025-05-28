import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import cors from 'cors';
// Load .env variables
dotenv.config(); // This assumes .env is in the same directory

const app = express();


app.use(cors({
 origin:"http://localhost:5173",
credentials: true,  
}))

const port = process.env.PORT || 4000;

const dbUrl = process.env.DB_CONNECTION_URL;
// console.log("DB URL:", dbUrl); // Check if it prints correctly

app.use(express.json());

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

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});
