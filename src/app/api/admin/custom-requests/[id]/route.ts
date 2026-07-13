import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "MOCKUP_SENT", "COMPLETED"]).optional(),
  adminNotes: z.string().max(2000).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  try {
    const { id } = await params;
    const data = schema.parse(await req.json());
    await prisma.customRequest.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.customRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
