// app/api/auth/me/route.ts
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export const GET = async (req: NextRequest) => {
  try {
    // 1. 从 Cookie 中获取 token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 2. 验证 JWT
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (err) {
      return NextResponse.json(
        { error: "无效或过期的 token" },
        { status: 401 }
      );
    }

    // 3. 查询用户
    const user = await prisma.users.findUnique({
      where: { id: parseInt(decoded.userId) },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 401 });
    }

    // 4. 返回用户信息
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/auth/me 错误:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
};
