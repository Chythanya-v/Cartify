import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { hashSync } from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Admin User ──────────────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@cartify.com" },
    update: {},
    create: {
      email: "admin@cartify.com",
      password: hashSync("admin", 10),
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✓ Admin user ready");

  // ── Products ────────────────────────────────────────
  const products = [
    {
      name: "Wireless Headphones",
      description: "Over-ear noise cancelling headphones with 30hr battery life",
      price: 79.99,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    },
    {
      name: "Mechanical Keyboard",
      description: "Compact TKL mechanical keyboard with RGB backlighting",
      price: 109.99,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    },
    {
      name: "USB-C Hub",
      description: "7-in-1 USB-C hub with HDMI, SD card reader and fast charging",
      price: 39.99,
      stock: 100,
      imageUrl: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400",
    },
    {
      name: "Smartwatch",
      description: "Fitness tracking smartwatch with heart rate monitor",
      price: 199.99,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    },
    {
      name: "Bluetooth Speaker",
      description: "Portable waterproof speaker with 360 degree sound",
      price: 59.99,
      stock: 60,
      imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    },
    {
      name: "Laptop Stand",
      description: "Adjustable aluminium laptop stand for desks",
      price: 34.99,
      stock: 75,
      imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }
  console.log("✓ Products ready");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());