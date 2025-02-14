"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function CartSummary() {
  const {
    subtotal,
    shipping,
    total,
    discountCode,
    discountAmount,
    giftWrapFee,
    applyDiscount,
  } = useCart();
  const { toast } = useToast();

  const handleApplyDiscount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = new FormData(form).get("discountCode") as string;

    if (!code?.trim()) {
      toast({
        variant: "destructive",
        description: "Please enter a discount code",
      });
      return;
    }

    try {
      applyDiscount(code);
      toast({
        description: "Discount applied successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Invalid discount code",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}</span>
          </div>
          {giftWrapFee > 0 && (
            <div className="flex justify-between">
              <span>Gift Wrapping</span>
              <span>${giftWrapFee.toFixed(2)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${(subtotal * discountAmount).toFixed(2)}</span>
            </div>
          )}
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleApplyDiscount} className="space-y-2">
          <Label htmlFor="discountCode">Discount Code</Label>
          <div className="flex gap-2">
            <Input
              id="discountCode"
              name="discountCode"
              placeholder="Enter code"
            />
            <Button type="submit">Apply</Button>
          </div>
          {discountCode && (
            <p className="text-sm text-green-600">
              Code &ldquo;{discountCode}&rdquo; applied
            </p>
          )}
        </form>

        <Link href="/checkout">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>

        <div className="text-sm text-muted-foreground">
          <p>Free shipping on orders over $100</p>
          <p>Gift wrapping available for $5 per item</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(CartSummary);
