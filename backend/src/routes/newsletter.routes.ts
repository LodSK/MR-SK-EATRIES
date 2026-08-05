import { Router } from "express";
import { z } from "zod";
import * as newsletterController from "@/controllers/newsletter.controller";
import { validate } from "@/middleware/validate.middleware";

const router = Router();

router.post(
  "/newsletter/subscribe",
  validate(z.object({ email: z.string().email() })),
  newsletterController.subscribe
);

export default router;
