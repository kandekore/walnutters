import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/adminApi";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

type Params = { params: Promise<{ key: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireAdminApi();
  if (guard) return guard;

  try {
    const { key } = await params;
    const form = await req.formData();
    const image = await saveUpload(form.get("image") as File | null);

    const data: { title: string | null; body: string | null; videoUrl: string | null; imagePath?: string } = {
      title: String(form.get("title") ?? "") || null,
      body: String(form.get("body") ?? "") || null,
      videoUrl: String(form.get("videoUrl") ?? "") || null,
    };
    if (image) data.imagePath = image.publicPath;

    await prisma.siteContent.upsert({
      where: { key },
      update: data,
      create: { key, ...data, imagePath: data.imagePath ?? null },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
