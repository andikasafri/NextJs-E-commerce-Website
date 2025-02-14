// import { getProduct, getProducts } from "@/lib/api";
import { getProduct, getProducts } from "lib/productApi";

import { Product } from "@/lib/types";
import ProductDetails from "./product-details";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products: Product[] = await getProducts(0, 100);
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(parseInt(params.id));
  return <ProductDetails product={product} />;
}
