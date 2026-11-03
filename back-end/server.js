import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/mongodb.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Hello server is running on http://localhost:${PORT}`);
});
