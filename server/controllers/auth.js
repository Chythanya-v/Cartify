import { hashSync, compareSync } from "bcrypt";
import { prisma } from "../prisma.js";


export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashSync(password, 10),
                name: name || null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};