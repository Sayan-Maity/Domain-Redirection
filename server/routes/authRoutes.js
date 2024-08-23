import express from "express";
import { nonceGeneration, verifyUser } from "../controllers/authControllers.js";
const router = express.Router();

router.get("/nonce", nonceGeneration);
router.post("/verify", verifyUser);

export default router;
