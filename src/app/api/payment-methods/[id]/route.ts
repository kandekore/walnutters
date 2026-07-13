import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

async function ownedMethod(id: string, userId: string) {
  const pm = await prisma.paymentMethod.findUnique({ where: { id } });
  return pm && pm.userId === userId ? pm : null;
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const pm = await ownedMethod(id, session.user.id);
  if (!pm) return NextResponse.json({ ok: false }, { status: 404 });

  await prisma.paymentMethod.delete({ where: { id } });

  // Promote another card to default if we removed the default one.
  if (pm.isDefault) {
    const next = await prisma.paymentMethod.findFirst({ where: { userId: session.user.id } });
    if (next) await prisma.paymentMethod.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await params;
  const pm = await ownedMethod(id, session.user.id);
  if (!pm) return NextResponse.json({ ok: false }, { status: 404 });

  await prisma.paymentMethod.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
  await prisma.paymentMethod.update({ where: { id }, data: { isDefault: true } });
  return NextResponse.json({ ok: true });
}
