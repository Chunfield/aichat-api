import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withCORS } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const POST = withCORS(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "缺少字段" }, { status: 400 });
    }

    // 查用户
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 验证明文密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // 生成 JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({
      user: { id: user.id, username: user.username },
      message: "登录成功",
    });

    // 设置 Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 生产环境必须为 true
      sameSite: "strict", // 可改为 "none" 支持跨站，但必须配合 secure: true
      maxAge: TOKEN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
});
