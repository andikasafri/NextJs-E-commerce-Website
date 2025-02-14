"use client";

import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductGrid from "@/components/product-grid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState, useMemo } from "react";

interface ClientProps {
  products: Product[];
  category: Category;
  categories: Category[];
}

export default function CategoryClientPage({
  products,
  category,
  categories,
}: ClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoized filtered products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const searchTerms = searchQuery.toLowerCase().split(" ");
    return products.filter((product) => {
      const searchableText =
        `${product.title} ${product.description} ${product.category.name}`.toLowerCase();
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [products, searchQuery]);

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href="/categories"
          className="text-muted-foreground hover:text-foreground"
        >
          Categories
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{category.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Categories</SheetTitle>
              </SheetHeader>
              <CategoryList categories={categories} currentId={category.id} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block space-y-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <CategoryList categories={categories} currentId={category.id} />
        </div>

        <div className="lg:col-span-3">
          <header className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </header>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No products found matching your search.
              </p>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryList({
  categories,
  currentId,
}: {
  categories: Category[];
  currentId: number;
}) {
  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.id}`}
          className={`block p-2 rounded-lg transition-colors ${
            cat.id === currentId
              ? "bg-accent font-medium"
              : "hover:bg-accent/50"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
