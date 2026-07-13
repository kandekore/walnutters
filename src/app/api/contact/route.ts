import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Please check your details." }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
