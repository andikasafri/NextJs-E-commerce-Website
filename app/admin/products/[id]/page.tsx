// "use client";

// import { use } from "react";
// import { getProduct, updateProduct } from "lib/api";
// import { getCategories } from "lib/categoryApi";
// import { ProductForm } from "components/admin/product-form";
// import { useEffect, useState } from "react";
// import { Product, Category } from "lib/types";
// import { Skeleton } from "components/ui/skeleton";
// import { useToast } from "hooks/use-toast";

// type Params = Promise<{ id: string }>;

// export default async function EditProductPage({ params }: { params: Params }) {
//   const { id } = await params; // Await the params
//   const [loading, setLoading] = useState(true);
//   const [product, setProduct] = useState<Product | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [productData, categoriesData] = await Promise.all([
//           getProduct(parseInt(id)), // Use the awaited id
//           getCategories(),
//         ]);
//         setProduct(productData);
//         setCategories(categoriesData);
//       } catch (error) {
//         console.error("Failed to fetch ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <Skeleton className="h-10 w-48" />
//         <div className="space-y-4">
//           <Skeleton className="h-[400px]" />
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold">Product Not Found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">Edit Product</h1>
//       <ProductForm
//         product={product}
//         categories={categories}
//         onSubmit={async (formData) => {
//           try {
//             await updateProduct(parseInt(id), formData);
//             toast({
//               description: "Product updated successfully",
//             });
//           } catch (err) {
//             console.error("Failed to update product:", err);
//             toast({
//               variant: "destructive",
//               description: "Failed to update product",
//             });
//           }
//         }}
//       />
//     </div>
//   );
// }
"use client";

import { getProduct, updateProduct } from "lib/api";
import { getCategories } from "lib/categoryApi";
import { ProductForm } from "components/admin/product-form";
import { useEffect, useState } from "react";
import { Product, Category } from "lib/types";
import { Skeleton } from "components/ui/skeleton";
import { useToast } from "hooks/use-toast";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData] = await Promise.all([
          getProduct(parseInt(params.id)),
          getCategories(),
        ]);
        setProduct(productData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={async (formData) => {
          try {
            await updateProduct(parseInt(params.id), formData);
            toast({
              description: "Product updated successfully",
            });
          } catch (err) {
            console.error("Failed to update product:", err);
            toast({
              variant: "destructive",
              description: "Failed to update product",
            });
          }
        }}
      />
    </div>
  );
}