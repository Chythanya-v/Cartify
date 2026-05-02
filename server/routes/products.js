import { Router } from "express";

const productsRouter = Router();

productsRouter.get("/", (req, res) => {
    res.json({ message: "Get all products" });
});

productsRouter.post("/", (req, res) => {
    res.json({ message: "Create a new product" });
});

productsRouter.get("/:id", (req, res) => {
    res.json({ message: `Get product with ID ${req.params.id}` });
});

productsRouter.put("/:id", (req, res) => {
    res.json({ message: `Update product with ID ${req.params.id}` });
});

productsRouter.delete("/:id", (req, res) => {
    res.json({ message: `Delete product with ID ${req.params.id}` });
});

export default productsRouter;