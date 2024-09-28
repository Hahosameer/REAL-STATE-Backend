import express from "express";
import { addMessage } from "../controllers/messagesControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import { addMessage } from "../controllers/messagesControllers.js";
// import { getMessages } from "../controllers/messagesControllers.j";


const router = express.Router();

router.post("/:chatId", verifyToken, addMessage);


export default router;
