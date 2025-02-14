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

// Lazy load charts as they're heavy and below the fold
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

        // Measure and report performance after data load
        const metrics = measurePageLoad();
        if (metrics) {
          const performanceMetrics: PerformanceMetrics = {
            ttfb: metrics.ttfb,
            fcp: metrics.fcp || 0,
            lcp: metrics.lcp,
            totalLoadTime: metrics.totalLoadTime,
          };
          reportPerformanceMetrics(performanceMetrics);
        } else {
          console.error("Failed to measure page load performance.");
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
      {/* Stats Cards - Immediately visible content */}
      <StatsCards stats={stats} />

      {/* Charts - Below the fold, lazy loaded */}
      <ErrorBoundary>
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Revenue Breakdown</h2>
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

        {/* Analytics Components - Dynamically imported */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DynamicSalesForecast />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <DynamicCustomerSegments />
          </Suspense>
        </div>

        {/* Inventory Management - Dynamically imported */}
        <Suspense fallback={<Skeleton className="h-[600px]" />}>
          <DynamicInventoryManagement />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Extracted to separate component for better code organization
function StatsCards({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Example usage of stats */}
      <div className="stat-card">
        <h3>Total Revenue</h3>
        <p>{stats.revenue.total}</p>
      </div>
      <div className="stat-card">
        <h3>Total Orders</h3>
        <p>{stats.orders.total}</p>
      </div>
      <div className="stat-card">
        <h3>Total Customers</h3>
        <p>{stats.customers.total}</p>
      </div>
      <div className="stat-card">
        <h3>Total Inventory</h3>
        <p>{stats.inventory.total}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
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

export default withAuth(AdminDashboard, { requireAdmin: true });
