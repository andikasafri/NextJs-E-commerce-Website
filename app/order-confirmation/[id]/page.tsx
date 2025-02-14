// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../../../lib/contexts/auth-context"; // Updated path
// import { useCart } from "../../../lib/contexts/cart-context"; // Updated path
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card"; // Updated path
// import { Button } from "../../../components/ui/button"; // Updated path
// import { CheckCircle2 } from "lucide-react";
// import Link from "next/link";

// interface OrderConfirmationPageProps {
//   params: {
//     id: string;
//   };
// }

// export default function OrderConfirmationPage({
//   params,
// }: OrderConfirmationPageProps) {
//   const router = useRouter();
//   const { user } = useAuth(); // Updated to use user
//   const { clearCart } = useCart(); // Added useCart

//   useEffect(() => {
//     const handleCartState = () => {
//       if (user?.cart.length === 0) {
//         // Updated to check user.cart
//         router.push("/");
//       } else {
//         clearCart(); // Updated to clearCart from useCart
//       }
//     };

//     handleCartState();
//   }, [router, user?.cart.length, clearCart]); // Updated dependencies

//   return (
//     <div className="container mx-auto px-4 py-16 max-w-2xl">
//       <Card className="text-center">
//         <CardHeader>
//           <div className="flex justify-center mb-4">
//             <CheckCircle2 className="h-16 w-16 text-green-500" />
//           </div>
//           <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <p className="text-muted-foreground">
//             Thank you for your order. We&apos;ve received your order and will
//             begin processing it right away. You will receive an email
//             confirmation shortly.
//           </p>

//           <div className="space-y-2">
//             <p className="font-semibold">Order Number</p>
//             <p className="font-mono text-lg">{params.id}</p>
//           </div>

//           <div className="flex justify-center gap-4">
//             <Link href="/account?tab=orders">
//               <Button variant="outline">View Order Status</Button>
//             </Link>
//             <Link href="/">
//               <Button>Continue Shopping</Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { useCart } from "@/lib/contexts/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart } = useCart();

  useEffect(() => {
    if (user?.cart.length === 0) {
      router.push("/");
    } else {
      clearCart();
    }
  }, [router, user?.cart.length, clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ve received your order and will
            begin processing it right away. You will receive an email
            confirmation shortly.
          </p>

          <div className="space-y-2">
            <p className="font-semibold">Order Number</p>
            <p className="font-mono text-lg">{params.id}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/account?tab=orders">
              <Button variant="outline">View Order Status</Button>
            </Link>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
