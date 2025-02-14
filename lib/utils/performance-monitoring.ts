// Future implementation of performance monitoring utilities
// Performance monitoring utilities
export function measurePageLoad() {
  if (typeof window === "undefined") return;

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  const paintMetrics = performance.getEntriesByType("paint");

  return {
    // Time to First Byte (TTFB)
    ttfb: navigation.responseStart - navigation.requestStart,

    // First Contentful Paint (FCP)
    fcp: paintMetrics.find(({ name }) => name === "first-contentful-paint")
      ?.startTime,

    // Largest Contentful Paint (LCP)
    lcp: navigation.loadEventEnd - navigation.loadEventStart,

    // Total Page Load Time
    totalLoadTime: navigation.loadEventEnd - navigation.requestStart,
  };
}

export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  totalLoadTime: number;
  // loadTime: number; // Load time in milliseconds
  // firstContentfulPaint: number; // Time to first contentful paint in milliseconds
}

export function reportPerformanceMetrics(metrics: PerformanceMetrics) {
  // Send metrics to your analytics service
  console.log("Performance Metrics:", metrics);
}

// Monitor chunk loading performance
export function monitorChunkLoading() {
  if (typeof window === "undefined") return;

  performance.mark("chunk-load-start");

  window.addEventListener("load", () => {
    performance.mark("chunk-load-end");
    const measurement = performance.measure(
      "chunk-loading",
      "chunk-load-start",
      "chunk-load-end"
    );
    console.log("Chunk Loading Time:", measurement.duration);
  });
}
