import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/products.js";

const productsRouter = Router();

productsRouter.use(authenticate); // All product routes require authentication

productsRouter.get("/", getProducts);
productsRouter.post("/", createProduct);
productsRouter.get("/:id", getProductById);
productsRouter.put("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);

export default productsRouter;