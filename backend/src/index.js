import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import path from "path"

import { connectDB } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js"

dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve()

if (process.env.NODE_ENV === "production") {
  // Point to the dist folder one level up from backend/
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
    connectDB()
})