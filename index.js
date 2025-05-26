import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config(); // This assumes .env is in the same directory

const app = express();
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
