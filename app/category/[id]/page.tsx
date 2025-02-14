import { getProducts, getCategories } from "@/lib/api";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    id: category.id.toString(),
  }));
}

const CategoryClientPage = dynamic(() => import("./CategoryClientPage"));

type PageProps = {
  params: { id: string };
};

export default async function CategoryPage({ params }: PageProps) {
  const categoryId = parseInt(params.id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const [products, categories] = await Promise.all([
    getProducts(0, 50),
    getCategories(),
  ]);

  const category = categories.find((c) => c.id === categoryId);
  if (!category) notFound();

  const filteredProducts = products.filter((p) => p.category.id === categoryId);

  return (
    <CategoryClientPage
      products={filteredProducts}
      category={category}
      categories={categories}
    />
  );
}
