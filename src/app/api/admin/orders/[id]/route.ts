import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";

export const runtime = "nodejs";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED"]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  try {
    const { id } = await params;
    const { status } = schema.parse(await req.json());
    await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not update order." }, { status: 400 });
  }
}
