import { Router } from "express";
import * as paymentController from "@/controllers/payment.controller";

const router = Router();

router.post("/payments/paystack/webhook", paymentController.paystackWebhook);

export default router;
