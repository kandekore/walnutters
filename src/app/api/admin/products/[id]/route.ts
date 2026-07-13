import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";
import { parseProductForm } from "@/lib/productForm";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  try {
    const { id } = await params;
    const form = await req.formData();
    const { data } = await parseProductForm(form);

    // Slug uniqueness (excluding this product).
    const clash = await prisma.product.findFirst({ where: { slug: data.slug, NOT: { id } } });
    if (clash) {
      return NextResponse.json({ ok: false, error: "Another product already uses that slug." }, { status: 409 });
    }

    await prisma.product.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not update product.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  const { id } = await params;
  // Keep order history intact: soft-delete by deactivating rather than hard delete
  // when the product has been ordered; otherwise remove it entirely.
  const orderItems = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItems > 0) {
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ ok: true, softDeleted: true });
  }
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
