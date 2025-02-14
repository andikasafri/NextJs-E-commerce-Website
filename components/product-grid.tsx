"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
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

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (product: Product) => {
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

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/fallback.jpg"; // Replace with your fallback image path
  };

  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group">
          <CardHeader className="p-0">
            <Link href={`/product/${product.id}`}>
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  priority
                  onError={handleImageError}
                />
              </div>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <Link href={`/product/${product.id}`}>
              <CardTitle className="line-clamp-1 hover:text-primary">
                {product.title}
              </CardTitle>
            </Link>
            <p className="text-2xl font-bold text-primary mt-2">
              ${product.price}
            </p>
            <p className="text-muted-foreground line-clamp-2 mt-2">
              {product.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
