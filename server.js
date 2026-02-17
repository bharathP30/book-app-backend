import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import "dotenv/config";

import bookRouter from "./routes/bookAPI.js";
import authRouter from "./routes/authAPI.js";
import { Authenticate } from "./middleware/auth.js";

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",                        // Local dev
        "https://book-app-frontend-ecru.vercel.app"    // Your Vercel URL
    ]
}));
app.use(express.json());

    async function main() {
        try {
            await mongoose.connect(process.env.MONGODB_URL);
            console.log("connected to database and name is ", mongoose.connection.name)
            console.log("database host is ", mongoose.connection.host);
            console.log("database port is ", mongoose.connection.port);
            console.log("database ready state is ", mongoose.connection.readyState);

            app.use("/api/books", Authenticate, bookRouter);
            app.use("/api/auth", authRouter);

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
                console.log("Express server is running on port ", PORT);
        });

        } catch (error) {
            console.error("error while connecting to database ", error);
            process.exit(1);
        }
    }

     main();




