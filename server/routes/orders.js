import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/orders.js";

const ordersRouter = Router();

ordersRouter.use(authenticate); // All order routes require authentication

ordersRouter.post("/", createOrder);
ordersRouter.get("/my-orders", getMyOrders);
ordersRouter.get("/:id", getOrderById);
ordersRouter.get("/", getAllOrders); // Admin only
ordersRouter.put("/:id/status", updateOrderStatus); // Admin only

export default ordersRouter;