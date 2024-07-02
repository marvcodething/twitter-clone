import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); //middleware to parse req.body
app.use(express.urlencoded({extended: true})); //middleware to parse urlencoded data
app.use(cookieParser()); //middleware to parse cookies
app.use("/api/auth", authRoutes);

app.listen(PORT,() => {
    console.log(`server is up and running on port ${PORT}`);
    connectMongoDB();
})