import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** Guard for admin API routes. Returns null when authorised, or a 401/403 response. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
  }
  return null;
}
