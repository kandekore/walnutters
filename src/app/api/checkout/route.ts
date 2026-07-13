import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SHIPPING_FLAT, effectivePrice } from "@/lib/money";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const schema = z.object({
  items: z
    .array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(99) }))
    .min(1),
  customer: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email(),
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional().or(z.literal("")),
    city: z.string().min(1).max(120),
    postcode: z.string().min(1).max(20),
    country: z.string().min(1).max(80).default("United Kingdom"),
  }),
});

function orderNumber() {
  return `WN-${Date.now().toString().slice(-8)}`;
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const session = await auth();

    // Recompute prices from the database — never trust client-supplied amounts.
    const slugs = body.items.map((i) => i.slug);
    const products = await prisma.product.findMany({ where: { slug: { in: slugs }, active: true } });
    const bySlug = new Map(products.map((p) => [p.slug, p]));

    const lineItems = body.items
      .map((i) => {
        const p = bySlug.get(i.slug);
        if (!p) return null;
        return { product: p, quantity: i.quantity, unitPrice: effectivePrice(p) };
      })
      .filter(Boolean) as { product: (typeof products)[number]; quantity: number; unitPrice: number }[];

    if (lineItems.length === 0) {
      return NextResponse.json({ ok: false, error: "No valid items in basket." }, { status: 400 });
    }

    const subtotal = lineItems.reduce((s, li) => s + li.unitPrice * li.quantity, 0);
    const shipping = SHIPPING_FLAT;
    const total = subtotal + shipping;
    const c = body.customer;

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber(),
        userId: session?.user?.id ?? null,
        email: c.email,
        customerName: c.name,
        status: stripeEnabled ? "PENDING" : "PAID",
        paymentStatus: stripeEnabled ? "unpaid" : "mock_paid",
        subtotal,
        shipping,
        total,
        shippingAddress: JSON.stringify({
          line1: c.line1,
          line2: c.line2 || undefined,
          city: c.city,
          postcode: c.postcode,
          country: c.country,
        }),
        items: {
          create: lineItems.map((li) => ({
            productId: li.product.id,
            name: li.product.name,
            unitPrice: li.unitPrice,
            quantity: li.quantity,
            imagePath: li.product.imagePath,
          })),
        },
      },
    });

    // Increment sales counters (drives Featured Figure of the Week).
    for (const li of lineItems) {
      await prisma.product.update({
        where: { id: li.product.id },
        data: { salesCount: { increment: li.quantity } },
      });
    }

    // Real Stripe path (only when keys are configured).
    if (stripeEnabled && stripe) {
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: c.email,
        line_items: lineItems.map((li) => ({
          quantity: li.quantity,
          price_data: {
            currency: "gbp",
            unit_amount: li.unitPrice,
            product_data: { name: li.product.name },
          },
        })),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shipping, currency: "gbp" },
              display_name: "UK standard delivery",
            },
          },
        ],
        success_url: `${site.url}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${site.url}/checkout`,
        metadata: { orderId: order.id },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentIntentId: checkout.id },
      });
      return NextResponse.json({ ok: true, url: checkout.url });
    }

    // Mock path: order recorded and marked paid, straight to confirmation.
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Please complete all required fields." }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ ok: false, error: "Checkout failed." }, { status: 500 });
  }
}
