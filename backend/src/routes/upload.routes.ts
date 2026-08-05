import { Router } from "express";
import * as uploadController from "@/controllers/upload.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload.middleware";

const router = Router();

router.post("/uploads/:folder", authenticate, upload.single("file"), uploadController.uploadImage);

export default router;
