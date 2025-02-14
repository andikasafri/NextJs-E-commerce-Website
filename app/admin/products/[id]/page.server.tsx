import { Metadata } from "next/types";
import { getProduct } from "lib/api";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params; // Await the params
  const product = await getProduct(parseInt(id));
  if (product) {
    return {
      title: `Edit ${product?.name || "Product"}`,
      description: `Edit details for product ${product?.name || "Product"}`,
    };
  } else {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}
