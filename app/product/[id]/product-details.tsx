"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthWishlist } from "@/lib/hooks/use-wishlist";
import { useAuth } from "@/lib/auth";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem: addToWishlist, hasItem: isInWishlist } = useAuthWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fallback image error handler: when an image fails to load, it switches to "/fallback.jpg"
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/fallback.jpg";
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addItem(product);
      toast({
        description: "Added to cart successfully",
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        variant: "destructive",
        description: "Failed to add to cart",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please login to add items to your wishlist",
      });
      return;
    }

    try {
      addToWishlist(product.id);
      toast({
        description: "Added to wishlist successfully",
      });
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast({
        variant: "destructive",
        description: "Failed to add to wishlist",
      });
    }
  };

  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          href={`/category/${product.category.id}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span>{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
              onError={handleImageError}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square relative overflow-hidden rounded-lg ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                  className="object-cover"
                  onError={handleImageError}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-3xl font-bold text-primary mt-2">
              ${product.price}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Category</h2>
            <Link
              href={`/category/${product.category.id}`}
              className="text-primary hover:underline"
            >
              {product.category.name}
            </Link>
          </div>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToWishlist}
              disabled={isInWishlist(product.id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist(product.id) ? "fill-current text-primary" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/4 mt-2" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
