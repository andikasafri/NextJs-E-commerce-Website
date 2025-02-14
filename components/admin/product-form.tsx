"use client";

import { useState } from "react";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (data: Partial<Product>) => Promise<void>;
}

export function ProductForm({
  product,
  categories,
  onSubmit,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      category: categories[0],
      images: [""],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      toast({
        description: `Product ${product ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: `Failed to ${product ? "update" : "create"} product`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Product Name</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value) })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category?.id.toString()}
          onValueChange={(value) => {
            const category = categories.find((c) => c.id.toString() === value);
            setFormData({ ...formData, category });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <div className="space-y-2">
          {formData.images?.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => {
                  const newImages = [...(formData.images || [])];
                  newImages[index] = e.target.value;
                  setFormData({ ...formData, images: newImages });
                }}
                placeholder="Image URL"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newImages = formData.images?.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, images: newImages });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                ...formData,
                images: [...(formData.images || []), ""],
              });
            }}
          >
            Add Image
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
