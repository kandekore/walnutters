import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";
import { GALLERY_CATEGORIES } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const customerName = String(form.get("customerName") ?? "").trim();
    const category = String(form.get("category") ?? "");
    const caption = String(form.get("caption") ?? "").trim();

    if (!customerName) {
      return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
    }
    const photo = await saveUpload(form.get("photo") as File | null);
    if (!photo) {
      return NextResponse.json({ ok: false, error: "Please attach a JPEG or PNG photo (max 5MB)." }, { status: 400 });
    }

    await prisma.galleryItem.create({
      data: {
        customerName,
        imagePath: photo.publicPath,
        category: GALLERY_CATEGORIES.includes(category) ? category : "Football rooms",
        caption: caption || null,
        approved: false, // held for moderation in the admin area
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submission failed.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
