import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { luhnValid, detectBrand, last4 } from "@/lib/cards";

export const runtime = "nodejs";

const schema = z.object({
  number: z.string().min(12).max(25),
  expMonth: z.coerce.number().int().min(1).max(12),
  expYear: z.coerce.number().int().min(2024).max(2100),
  makeDefault: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  try {
    const data = schema.parse(await req.json());
    if (!luhnValid(data.number)) {
      return NextResponse.json({ ok: false, error: "That card number doesn't look valid." }, { status: 400 });
    }

    const count = await prisma.paymentMethod.count({ where: { userId: session.user.id } });
    const makeDefault = data.makeDefault || count === 0;

    if (makeDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const pm = await prisma.paymentMethod.create({
      data: {
        userId: session.user.id,
        brand: detectBrand(data.number),
        last4: last4(data.number),
        expMonth: data.expMonth,
        expYear: data.expYear,
        isDefault: makeDefault,
      },
    });

    return NextResponse.json({ ok: true, id: pm.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Please check the card details." }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Could not save card." }, { status: 500 });
  }
}
