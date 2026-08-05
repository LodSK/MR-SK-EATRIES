import { Router } from "express";
import * as cartController from "@/controllers/cart.controller";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

router.get("/cart", authenticate, cartController.getCart);
router.post("/cart", authenticate, cartController.addToCart);
router.patch("/cart", authenticate, cartController.updateCartLine);
router.delete("/cart/:menuItemId", authenticate, cartController.removeFromCart);
router.delete("/cart", authenticate, cartController.clearCart);

export default router;
