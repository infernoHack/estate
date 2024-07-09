import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

/* Inside src folder */
("npx prisma db push");
("npx prisma generate");
