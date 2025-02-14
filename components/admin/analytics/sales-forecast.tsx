"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSalesForecasts } from "@/lib/admin/api";
import { SalesForecast } from "@/lib/admin/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

export function SalesForecastChart() {
  const [forecasts, setForecasts] = useState<SalesForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchForecasts = async () => {
      try {
        const data = await getSalesForecasts();
        setForecasts(data);
      } catch (error) {
        console.error("Failed to fetch sales forecasts:", error);
        toast({
          variant: "destructive",
          description: "Failed to load sales forecasts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchForecasts();
  }, [toast]);

  if (loading) {
    return <div>Loading forecasts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecasts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="predictedRevenue"
                stroke="hsl(var(--primary))"
                name="Predicted Revenue"
              />
              <Line
                type="monotone"
                dataKey="predictedOrders"
                stroke="hsl(var(--chart-2))"
                name="Predicted Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {forecasts.map((forecast) => (
            <div key={forecast.period} className="p-4 border rounded-lg">
              <h4 className="font-semibold">{forecast.period}</h4>
              <p className="text-sm text-muted-foreground">
                Confidence: {(forecast.confidence * 100).toFixed(1)}%
              </p>
              <div className="mt-2">
                <h5 className="text-sm font-medium">Key Factors:</h5>
                <ul className="text-sm">
                  {forecast.factors.map((factor) => (
                    <li key={factor.name}>
                      {factor.name}: {factor.impact > 0 ? "+" : ""}
                      {factor.impact}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
