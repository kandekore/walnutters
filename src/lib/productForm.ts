import { saveUpload } from "@/lib/upload";

/** Shared parser turning a product admin form (multipart) into Prisma data. */
export async function parseProductForm(form: FormData) {
  const name = String(form.get("name") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();
  const slug =
    (slugRaw || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product";

  const regularPounds = parseFloat(String(form.get("regularPrice") ?? "0"));
  const salePoundsRaw = String(form.get("salePrice") ?? "").trim();
  const salePence = salePoundsRaw ? Math.round(parseFloat(salePoundsRaw) * 100) : null;

  const occasions = String(form.get("occasions") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const image = await saveUpload(form.get("image") as File | null);

  const data: {
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    regularPrice: number;
    salePrice: number | null;
    category: string | null;
    era: string | null;
    occasions: string;
    featured: boolean;
    active: boolean;
    stockStatus: string;
    imagePath?: string;
    gallery?: string;
  } = {
    name,
    slug,
    shortDescription: String(form.get("shortDescription") ?? "") || null,
    description: String(form.get("description") ?? "") || null,
    regularPrice: Math.round((isNaN(regularPounds) ? 0 : regularPounds) * 100),
    salePrice: salePence && !isNaN(salePence) ? salePence : null,
    category: String(form.get("category") ?? "") || null,
    era: String(form.get("era") ?? "") || null,
    occasions: JSON.stringify(occasions),
    featured: form.get("featured") === "on" || form.get("featured") === "true",
    active: form.get("active") !== "off" && form.get("active") !== "false",
    stockStatus: String(form.get("stockStatus") ?? "in_stock") || "in_stock",
  };

  if (image) {
    data.imagePath = image.publicPath;
    data.gallery = JSON.stringify([image.publicPath]);
  }

  return { data, hasImage: Boolean(image), name, slug };
}
