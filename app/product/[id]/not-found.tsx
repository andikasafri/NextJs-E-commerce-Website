// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default function ProductNotFound() {
//   return (
//     <div className="container mx-auto px-4 py-16 text-center">
//       <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
//       <p className="text-muted-foreground mb-8">
//         The product you&apos;re looking for doesn&apos;t exist or has been
//         removed.
//       </p>
//       <Link href="/products">
//         <Button>Browse All Products</Button>
//       </Link>
//     </div>
//   );
// }
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link href="/">
        <Button>Go to Homepage</Button>
      </Link>
    </div>
  );
}
