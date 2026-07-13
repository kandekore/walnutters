/** Format an amount stored in pence as a GBP string, e.g. 1200 -> "£12.00". */
export function formatPrice(pence: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(pence / 100);
}

/** The price a customer actually pays: sale price when present, else regular. */
export function effectivePrice(product: {
  regularPrice: number;
  salePrice?: number | null;
}): number {
  return product.salePrice ?? product.regularPrice;
}

export const SHIPPING_FLAT = 395; // £3.95 flat UK shipping, in pence
