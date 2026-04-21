import { prisma } from "../server/prisma.js";
import { hashSync } from "bcrypt";


async function main() {
  await prisma.user.create({
    data: {
      email: "admin@cartify.com",
      password: hashSync("admin", 10),
      name: "Admin",
      role: "ADMIN",         // explicitly set here
    },
  });

  console.log("Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());