import express from 'express';

const app = express();
const port = 4000;

// Middleware (optional)
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("The server running"); // Fixed typo: `Send` → `send`, and added `req`
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});