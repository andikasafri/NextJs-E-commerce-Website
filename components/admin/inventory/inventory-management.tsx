"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInventoryStats } from "@/lib/admin/api";
import { InventoryStats } from "@/lib/admin/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function InventoryManagement() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getInventoryStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch inventory stats:", error);

        toast({
          variant: "destructive",
          description: "Failed to load inventory stats",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats.summary.totalProducts}
              </div>
              <p className="text-muted-foreground">Total Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.summary.lowStock}
              </div>
              <p className="text-muted-foreground">Low Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {stats.summary.outOfStock}
              </div>
              <p className="text-muted-foreground">Out of Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats.summary.averageTurnover.toFixed(1)}
              </div>
              <p className="text-muted-foreground">Avg. Turnover (days)</p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Reorder Point</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Out of Stock
                    </Badge>
                  ) : product.stock <= product.reorderPoint ? (
                    <Badge
                      variant="warning"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="success"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      In Stock
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.lastRestocked).toLocaleDateString()}
                </TableCell>
                <TableCell>{product.reorderPoint}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
