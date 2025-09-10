import { NextRequest, NextResponse } from "next/server";
import { withCORS } from "@/lib/cors";

export const POST = withCORS(async (req: NextRequest) => {
  try {
    // 创建响应
    const response = NextResponse.json(
      { message: "登出成功" },
      { status: 200 }
    );

    // 清除 token Cookie
    // 注意：domain 不要设置，除非你跨子域名共享 Cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 生产环境必须为 true
      sameSite: "none",
      maxAge: 0, // 设置过期（立即删除）
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("登出接口错误:", error);
    return NextResponse.json({ error: "登出失败" }, { status: 500 });
  }
});
