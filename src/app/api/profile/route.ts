import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120),
  password: z.string().min(6).max(200).optional().or(z.literal("")),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const data = schema.parse(await req.json());
    const update: { name: string; passwordHash?: string } = { name: data.name };
    if (data.password) {
      update.passwordHash = await bcrypt.hash(data.password, 10);
    }
    await prisma.user.update({ where: { id: session.user.id }, data: update });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Please check your details." }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 500 });
  }
}
