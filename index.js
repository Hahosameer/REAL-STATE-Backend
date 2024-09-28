import express from "express";
import postRoute from "./routes/postRoute.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT || 8800;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"; // Use environment variable or default

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: CLIENT_URL, // Allow requests from the client URL
    credentials: true, // Allow credentials such as cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
  })
);

app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS configured to allow requests from ${CLIENT_URL}`);
});
