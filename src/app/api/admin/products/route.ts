import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";
import { parseProductForm } from "@/lib/productForm";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  try {
    const form = await req.formData();
    const { data, name } = await parseProductForm(form);
    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "A product with that slug already exists." }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        gallery: data.gallery ?? "[]",
        imagePath: data.imagePath ?? null,
      },
    });
    return NextResponse.json({ ok: true, id: product.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not create product.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
