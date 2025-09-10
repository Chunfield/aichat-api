import { NextRequest, NextResponse } from "next/server";
console.log("📦 CORS 模块被加载了！");

const ALLOWED_ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://ai-chat-azure-one.vercel.app";
export function withCORS(
  handler: (req: NextRequest) => Promise<Response> | Response
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    console.log("🔧 CORS Middleware 执行了！请求路径:", req.url);
    console.log("🧩 请求方法:", req.method);
    // 1. 处理 OPTIONS 预检请求
    if (req.method === "OPTIONS") {
      return NextResponse.json(
        {},
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // 2. 调用实际处理函数
    let response: Response;
    try {
      response = (await handler(req)) as Response;
    } catch (error) {
      console.error("API Handler Error:", error);
      response = NextResponse.json(
        { error: "服务器内部错误" },
        { status: 500 }
      );
    }

    // 3. 克隆响应并添加 CORS 头
    const modifiedResponse = new NextResponse(response.body, response);
    modifiedResponse.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    modifiedResponse.headers.set("Access-Control-Allow-Credentials", "true");

    return modifiedResponse;
  };
}
