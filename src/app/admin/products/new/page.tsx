import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-extrabold text-heading">New product</h2>
      <ProductForm
        initial={{
          name: "",
          slug: "",
          shortDescription: "",
          description: "",
          regularPrice: "12.00",
          salePrice: "",
          category: "",
          era: "",
          occasions: [],
          featured: false,
          active: true,
          stockStatus: "in_stock",
          imagePath: null,
        }}
      />
    </div>
  );
}
