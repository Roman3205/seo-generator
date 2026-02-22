// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "~~/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const config = useRuntimeConfig()

const prismaClientSingleton = () => {
  // const pool = new PrismaPg({ connectionString:  config.dbUrl});
  // return new PrismaClient({adapter: pool})
  return new PrismaClient({ accelerateUrl: config.dbUrl }).$extends(withAccelerate());
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;