import { getProducts } from "@/lib/productApi";
import { getCategories } from "@/lib/categoryApi";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HomePageData {
  products: Product[];
  categories: Category[];
}

async function getData(): Promise<HomePageData> {
  const [products, categories] = await Promise.all([
    getProducts(0, 6), // Limit to 6 featured products
    getCategories(),
  ]);
  return {
    products,
    categories: categories.slice(0, 6), // Limit to 6 categories
  };
}

export default async function Home() {
  const { products, categories } = await getData();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Categories</h2>
          <Link href="/categories">
            <Button variant="ghost">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category: Category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={category.image || "/fallback.jpg"}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={category.id <= 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 flex items-end p-4">
                  <h3 className="text-white text-xl font-semibold">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products">
            <Button variant="ghost">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <Card key={product.id} className="group overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <Button className="w-full">View Details</Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
