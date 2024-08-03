// app.js
import express from "express";
import cors from "cors";
import router from "./routes/userRoute.js";
import { pool } from "./db.js";
import authRoute from "./routes/authRoute.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api/users", router);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Database connection successful:", res.rows[0]);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
