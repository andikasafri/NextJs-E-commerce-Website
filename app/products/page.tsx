"use client";

import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll";
// import { getProducts } from '@/lib/api';
import { getProducts } from "@/lib/productApi";
import { Product } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";
import { memo } from "react";

const ITEMS_PER_PAGE = 12;

const MemoizedProductGrid = memo(ProductGrid);

export default function ProductsPage() {
  const loadMore = async () => {
    const products = await getProducts(items.length, ITEMS_PER_PAGE);
    return products;
  };

  const { items, loading, hasMore, targetRef } =
    useInfiniteScroll<Product>(loadMore);

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Products</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <div className="flex gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Button variant="outline">Filters</Button>
          </div>
        </div>

        <MemoizedProductGrid products={items} />

        {loading && <LoadingSpinner />}

        {hasMore && <div ref={targetRef} className="h-10" />}
      </div>
    </ErrorBoundary>
  );
}
