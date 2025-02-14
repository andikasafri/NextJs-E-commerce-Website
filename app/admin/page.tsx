"use client";

import { withAuth } from "lib/hoc/withAuth";
import { Card } from "components/ui/card";
import { BarChart, DollarSign, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getStats } from "lib/api";
import { Skeleton } from "components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminStats } from "lib/admin/types";

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        // Type guard to ensure response matches AdminStats
        if (
          response &&
          "revenue" in response &&
          "orders" in response &&
          "customers" in response &&
          "inventory" in response
        ) {
          setStats(response as unknown as AdminStats);
        } else {
          console.error("Invalid stats data format");
          setStats(null);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-20" />
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <Skeleton className="h-[400px]" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Revenue: {stats?.revenue.total.toFixed(2)}
              </p>
              <p className="text-2xl font-bold">
                ${stats?.revenue.growth.toFixed(2)}%
              </p>
              <p className="text-sm text-green-600">+20.1% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Customers: {stats?.customers.total}
              </p>
              <p className="text-2xl font-bold">
                {stats?.customers.growth.toFixed(2)}%
              </p>
              <p className="text-sm text-green-600">+12.3% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Orders: {stats?.orders.total}
              </p>
              <p className="text-2xl font-bold">
                {stats?.orders.growth.toFixed(2)}%
              </p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <BarChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Conversion Rate: {stats?.conversionRate?.toFixed(2)}
              </p>
              <p className="text-2xl font-bold">
                {stats?.conversionRate?.toFixed(2)}%
              </p>
              <p className="text-sm text-red-600">-1.2% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Revenue Overview</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.revenueData?.graph}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export default withAuth(AdminDashboard, { requireAdmin: true });
