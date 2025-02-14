// app/admin/products/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getProducts } from "lib/productApi";
import { Product } from "lib/types";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Plus, Search } from "lucide-react";
import ProductTable from "components/admin/product-table";
import { ProductTableSkeleton } from "components/admin/product-table-skeleton";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts((page - 1) * 10, 10);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handleSearch = (searchTerm: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  };

  // Use the category to filter products
  const filteredProducts = category
    ? products.filter((product) => product.category.name === category)
    : products;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      {loading ? (
        <ProductTableSkeleton />
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </div>
  );
}
