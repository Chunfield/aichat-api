import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const response = NextResponse.json(
      { message: "登出成功" },
      { status: 200 }
    );

    // 🔥 清除 token Cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("登出接口错误:", error);
    return NextResponse.json({ error: "登出失败" }, { status: 500 });
  }
};
