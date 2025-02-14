"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerSegments } from "@/lib/admin/api";
import { CustomerSegment } from "@/lib/admin/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function CustomerSegments() {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const data = await getCustomerSegments();
        setSegments(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to load customer segments",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, [toast]);

  if (loading) {
    return <div>Loading segments...</div>;
  }

  const chartData = segments.map((segment) => ({
    name: segment.name,
    value: segment.size,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-4">
          {segments.map((segment) => (
            <div key={segment.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{segment.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {segment.size} customers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${segment.averageOrderValue.toFixed(2)} AOV
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {segment.purchaseFrequency} orders/month
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <h5 className="text-sm font-medium">Characteristics:</h5>
                <div className="mt-1 flex flex-wrap gap-2">
                  {segment.characteristics.map((char) => (
                    <span
                      key={char.key}
                      className="text-xs px-2 py-1 bg-secondary rounded-full"
                    >
                      {char.key}: {char.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
