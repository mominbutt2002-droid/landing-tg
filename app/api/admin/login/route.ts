import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (e) {
    console.error("POST /api/admin/login", e);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
