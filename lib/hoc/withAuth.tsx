"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth"; // Adjust the import path as necessary

interface WithAuthOptions {
  requireAdmin?: boolean; // Indicates if admin access is required
}

/**
 * Higher-order component for protecting routes based on authentication.
 *
 * @param WrappedComponent - The component to wrap with authentication logic.
 * @param options - Options for authentication requirements.
 * @returns A component that handles authentication logic.
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function WithAuthComponent(props: P) {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else if (options.requireAdmin && !isAdmin) {
        router.push("/"); // Redirect to home if not an admin
      }
    }, [user, isAdmin, router]);

    // Render the protected component
    return <WrappedComponent {...props} />;
  };
}
