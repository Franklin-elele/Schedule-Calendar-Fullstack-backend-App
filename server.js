import { config } from "dotenv";
config();

import express, { json } from "express";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

// Middleware
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173",
      "https://your-frontend.onrender.com"],
    credentials: true,
  })
);

// MongoDB Connection
connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error Connecting:", err));


// Base Route
app.get("/", (req, res) => {
  res.json("Server Listening");
});

// Routes
app.use("/", authRoutes);
app.use("/api", eventRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});
