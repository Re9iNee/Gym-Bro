import { PrismaClient } from "@prisma/client";
import { POSTGRES_PRISMA_URL } from "../lib/constants";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: POSTGRES_PRISMA_URL,
    },
  },
});

export default prisma;
