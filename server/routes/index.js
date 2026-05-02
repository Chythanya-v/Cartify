import { Router } from "express";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";


const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/orders", ordersRouter);
rootRouter.use("/products", productsRouter);

export default rootRouter;