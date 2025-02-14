"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Clock, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CartItems() {
  const {
    items,
    updateQuantity,
    removeItem,
    saveForLater,
    toggleGiftWrap,
    toggleItemSelection,
    selectedItems,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems,
    moveSelectedToWishlist,
  } = useCart();
  const { toast } = useToast();

  const handleQuantityUpdate = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      updateQuantity(productId, newQuantity);
      toast({
        description: "Cart updated successfully",
      });
    } catch (error) {
      console.error(`Error performing bulk  action:`, error);
      toast({
        variant: "destructive",
        description: "Failed to update cart",
      });
    }
  };

  const handleBulkAction = async (action: "remove" | "wishlist") => {
    try {
      if (action === "remove") {
        removeSelectedItems();
      } else {
        moveSelectedToWishlist();
      }
      toast({
        description:
          action === "remove"
            ? "Selected items removed"
            : "Selected items moved to wishlist",
      });
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast({
        variant: "destructive",
        description: "Failed to perform bulk action",
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cart Items</CardTitle>
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedItems.length === items.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  selectAllItems();
                } else {
                  deselectAllItems();
                }
              }}
            />
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("wishlist")}
                >
                  Move to Wishlist
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("remove")}
                >
                  Remove Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            <div className="flex items-center">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => toggleItemSelection(item.id)}
              />
            </div>
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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-primary font-bold">
                  ${(item.selectedVariant?.price || item.price).toFixed(2)}
                </p>
                {item.selectedVariant && (
                  <Badge variant="secondary">
                    {item.selectedVariant.size &&
                      `Size: ${item.selectedVariant.size}`}
                    {item.selectedVariant.color &&
                      ` Color: ${item.selectedVariant.color}`}
                  </Badge>
                )}
              </div>
              {item.estimatedDelivery && (
                <p className="text-sm text-muted-foreground mt-1">
                  Estimated delivery: {item.estimatedDelivery}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityUpdate(item.id, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleQuantityUpdate(item.id, item.quantity + 1)
                    }
                    disabled={
                      item.selectedVariant?.stock
                        ? item.quantity >= item.selectedVariant.stock
                        : false
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {item.selectedVariant && (
                  <p className="text-sm text-muted-foreground">
                    {item.selectedVariant.stock} in stock
                  </p>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleGiftWrap(item.id)}
                    className={item.giftWrap ? "text-primary" : ""}
                    title="Gift wrap"
                  >
                    {item.giftWrap ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Gift className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveForLater(item.id)}
                    title="Save for later"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {item.variants && (
                <div className="mt-2">
                  <Select
                    value={item.selectedVariant?.id.toString()}
                    onValueChange={(value) => {
                      const variant = item.variants?.find(
                        (v) => v.id.toString() === value
                      );
                      if (variant) {
                        // Update variant logic here
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {item.variants.map((variant) => (
                        <SelectItem
                          key={variant.id}
                          value={variant.id.toString()}
                          disabled={variant.stock === 0}
                        >
                          {variant.size && `Size ${variant.size}`}
                          {variant.color && ` - ${variant.color}`}
                          {variant.stock === 0 && " (Out of stock)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default memo(CartItems);
