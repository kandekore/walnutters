import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";

export const runtime = "nodejs";

const schema = z.object({ approved: z.boolean() });

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  try {
    const { id } = await params;
    const { approved } = schema.parse(await req.json());
    await prisma.galleryItem.update({ where: { id }, data: { approved } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Update failed." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;
  const { id } = await params;
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
