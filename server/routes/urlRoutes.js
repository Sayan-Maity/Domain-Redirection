import express from "express";
import { createRedirectUrl } from "../controllers/urlControllers.js";
const router = express.Router();

router.post("/create", createRedirectUrl);

export default router;
