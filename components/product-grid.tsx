"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuthWishlist } from "@/lib/hooks/use-wishlist";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { addItem: addToWishlist, hasItem: isInWishlist } = useAuthWishlist();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      addItem(product);
      toast({
        description: "Added to cart successfully",
      });
    } catch (error) {
      console.error(`Error adding to cart:`, error);
      toast({
        variant: "destructive",
        description: "Failed to add to cart",
      });
    }
  };

  const handleAddToWishlist = (product: Product) => {
    try {
      addToWishlist(product.id);
      toast({
        description: "Added to wishlist successfully",
      });
    } catch (error) {
      console.error(`Error adding to wishlist:`, error);
      toast({
        variant: "destructive",
        description: "Failed to add to wishlist",
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden card-hover">
          <Link href={`/product/${product.id}`}>
            <CardHeader className="p-0">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                {product.stock && product.stock < 5 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    Low Stock
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Link>
          <CardContent className="p-4">
            <Link href={`/product/${product.id}`}>
              <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                {product.title}
              </CardTitle>
            </Link>
            <p className="text-2xl font-bold text-primary mt-2">
              ${product.price}
            </p>
            <p className="text-muted-foreground line-clamp-2 mt-2 text-sm">
              {product.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 gap-2">
            <Button
              className="flex-1"
              onClick={() => handleAddToCart(product)}
              variant="default"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAddToWishlist(product)}
              disabled={isInWishlist(product.id)}
              className={isInWishlist(product.id) ? "text-primary" : ""}
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist(product.id) ? "fill-current" : ""
                }`}
              />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
