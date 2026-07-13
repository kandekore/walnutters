import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "Name and email are required." }, { status: 400 });
    }

    const [teamPhoto, kitPhoto, clubBadge] = await Promise.all([
      saveUpload(form.get("teamPhoto") as File | null),
      saveUpload(form.get("kitPhoto") as File | null),
      saveUpload(form.get("clubBadge") as File | null),
    ]);

    await prisma.customRequest.create({
      data: {
        name,
        email,
        favouritePlayer: String(form.get("favouritePlayer") ?? "") || null,
        hairColour: String(form.get("hairColour") ?? "") || null,
        shirtNumber: String(form.get("shirtNumber") ?? "") || null,
        pose: String(form.get("pose") ?? "") || null,
        personalMessage: String(form.get("personalMessage") ?? "") || null,
        teamPhotoPath: teamPhoto?.publicPath ?? null,
        kitPhotoPath: kitPhoto?.publicPath ?? null,
        clubBadgePath: clubBadge?.publicPath ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submission failed.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
