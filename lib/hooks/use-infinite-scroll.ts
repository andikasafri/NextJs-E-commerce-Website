import { useEffect, useRef, useState } from "react";

/**
 * Options for configuring the infinite scroll behavior.
 */
interface UseInfiniteScrollOptions {
  threshold?: number; // The percentage of the target's visibility to trigger loading more items.
  rootMargin?: string; // Margin around the root element.
}

/**
 * Custom hook for implementing infinite scrolling.
 *
 * @param loadMore - Function to load more items, returning a promise that resolves to an array of items.
 * @param options - Configuration options for the infinite scroll behavior.
 * @returns An object containing the loaded items, loading state, hasMore flag, and a ref for the target element.
 */
export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: UseInfiniteScrollOptions = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
          setLoading(true);
          try {
            const newItems = await loadMore();
            if (newItems.length === 0) {
              setHasMore(false);
            } else {
              setItems((prev) => [...prev, ...newItems]);
            }
          } catch (error) {
            console.error("Failed to load more items:", error);
          } finally {
            setLoading(false);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "50px",
      }
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [loadMore, loading, hasMore, options.threshold, options.rootMargin]);

  useEffect(() => {
    const currentTarget = targetRef.current;
    const currentObserver = observerRef.current;

    if (currentTarget && currentObserver) {
      currentObserver.observe(currentTarget);
    }

    return () => {
      if (currentTarget && currentObserver) {
        currentObserver.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading, options.threshold, options.rootMargin]);

  return {
    items,
    loading,
    hasMore,
    targetRef,
  };
}
