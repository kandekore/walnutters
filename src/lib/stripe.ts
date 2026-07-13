import Stripe from "stripe";

/**
 * Stripe runs in MOCK mode unless a secret key is configured. In mock mode the
 * checkout and payment-method flows still work end-to-end (orders are created,
 * cards are stored) but no real charges occur — so the app runs out of the box.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe = stripeEnabled
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;

export const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
