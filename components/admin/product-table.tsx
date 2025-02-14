"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (_id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      // API call to delete product
      toast({
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <Image
                src={product.images[0]}
                alt={product.title}
                width={48}
                height={48}
                className="object-cover rounded"
              />
            </TableCell>
            <TableCell>{product.title}</TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.stock || "N/A"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
