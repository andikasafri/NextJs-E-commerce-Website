"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/lib/cart";

function SavedItems() {
  const { savedItems, moveToCart, removeItem } = useCart();

  if (savedItems.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved for Later</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedItems.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            <Link
              href={`/product/${item.id}`}
              className="w-24 h-24 relative rounded-md overflow-hidden shrink-0"
            >
              <Image
                src={item.images[0]}
                alt={item.title}
                className="object-cover"
                fill
                sizes="96px"
                loading="lazy"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.id}`}
                className="font-semibold hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="text-primary font-bold mt-1">${item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="outline" onClick={() => moveToCart(item.id)}>
                  Move to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default memo(SavedItems);
