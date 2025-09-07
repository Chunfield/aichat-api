import { PrismaClient } from "@prisma/client";

// 用于在开发环境下避免热重载时重复创建实例
declare global {
  var prisma: PrismaClient | undefined;
}

// 如果是开发环境，使用 global.prisma
// 如果是生产环境，每次都 new
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
