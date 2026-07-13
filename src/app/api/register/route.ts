import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters").max(200),
});

export async function POST(req: Request) {
  try {
    const { name, email, password } = schema.parse(await req.json());
    const normalized = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email: normalized, passwordHash, role: "CUSTOMER" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: err.issues[0]?.message ?? "Invalid details." }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Registration failed." }, { status: 500 });
  }
}
