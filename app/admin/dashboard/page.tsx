"use client";

import { Suspense, lazy } from "react";
import { withAuth } from "@/lib/hoc/withAuth";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/admin/api";
import { AdminStats } from "@/lib/admin/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DynamicCustomerSegments,
  DynamicSalesForecast,
  DynamicInventoryManagement,
} from "@/lib/utils/dynamic-imports";
import { ErrorBoundary } from "@/components/error-boundary";
import {
  measurePageLoad,
  reportPerformanceMetrics,
  PerformanceMetrics,
} from "@/lib/utils/performance-monitoring";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

// Lazy load charts
const DynamicLineChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.LineChart }))
);
const DynamicLine = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Line }))
);
const DynamicXAxis = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.XAxis }))
);
const DynamicYAxis = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.YAxis }))
);
const DynamicCartesianGrid = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.CartesianGrid }))
);
const DynamicTooltip = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.Tooltip }))
);
const DynamicResponsiveContainer = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.ResponsiveContainer }))
);

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);

        // Measure and report performance
        const metrics = measurePageLoad();
        if (metrics) {
          const performanceMetrics: PerformanceMetrics = {
            ttfb: metrics.ttfb,
            fcp: metrics.fcp || 0,
            lcp: metrics.lcp,
            totalLoadTime: metrics.totalLoadTime,
          };
          reportPerformanceMetrics(performanceMetrics);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.total.toLocaleString()}`}
          change={stats.revenue.growth}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.total.toString()}
          change={stats.orders.growth}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatCard
          title="Total Customers"
          value={stats.customers.total.toString()}
          change={stats.customers.growth}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Products in Stock"
          value={stats.inventory.total.toString()}
          change={-((stats.inventory.lowStock / stats.inventory.total) * 100)}
          icon={<Package className="h-6 w-6" />}
        />
      </div>

      {/* Charts Section */}
      <ErrorBoundary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Revenue Trend</h2>
              <div className="h-[400px]">
                <DynamicResponsiveContainer width="100%" height="100%">
                  <DynamicLineChart data={stats.revenue.breakdown}>
                    <DynamicCartesianGrid strokeDasharray="3 3" />
                    <DynamicXAxis dataKey="period" />
                    <DynamicYAxis />
                    <DynamicTooltip />
                    <DynamicLine
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      name="Revenue"
                    />
                  </DynamicLineChart>
                </DynamicResponsiveContainer>
              </div>
            </Card>
          </Suspense>

          {/* Customer Segments */}
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DynamicCustomerSegments />
          </Suspense>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DynamicSalesForecast />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DynamicInventoryManagement />
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}) {
  const isPositive = change >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        <div
          className={`flex items-center ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <Skeleton className="h-[400px]" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-[400px]" />
        </Card>
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard, { requireAdmin: true });
