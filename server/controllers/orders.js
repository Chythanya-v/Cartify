import { prisma } from "../prisma.js";

// ── POST /orders ─────────────────────────────────────────
// Customer places an order
export const createOrder = async (req, res) => {
    const { items } = req.body;
    // items = [{ productId: "xxx", quantity: 2 }, ...]
    // req.user comes from your auth middleware

    try {
        // 1. Fetch all products being ordered
        const productIds = items.map((i) => i.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        // 2. Check stock and calculate total
        let total = 0;
        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for: ${product.name}` });
            }

            total += product.price * item.quantity;
        }

        // 3. Create order + items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user.id,
                    total,
                    items: {
                        create: items.map((item) => {
                            const product = products.find((p) => p.id === item.productId);
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                price: product.price, // snapshot price at purchase
                            };
                        }),
                    },
                },
                include: { items: true },
            });

            // 4. Deduct stock for each product
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return newOrder;
        });

        return res.status(201).json(order);
    } catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── GET /orders/my-orders ─────────────────────────────────
// Customer sees their own orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.json(orders);
    } catch (error) {
        console.error("Get my orders error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── GET /orders/:id ───────────────────────────────────────
// Customer sees a single order (must be their own)
export const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Prevent customers from viewing other users' orders
        if (order.userId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        return res.json(order);
    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── GET /orders ───────────────────────────────────────────
// Admin sees all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ── PATCH /orders/:id/status ──────────────────────────────
// Admin updates order status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "SHIPPED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return res.json(order);
    } catch (error) {
        console.error("Update status error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};