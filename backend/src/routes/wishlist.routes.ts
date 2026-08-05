import { Router } from "express";
import * as wishlistController from "@/controllers/wishlist.controller";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

router.get("/wishlist", authenticate, wishlistController.getWishlist);
router.post("/wishlist", authenticate, wishlistController.addToWishlist);
router.delete("/wishlist/:menuItemId", authenticate, wishlistController.removeFromWishlist);

export default router;
