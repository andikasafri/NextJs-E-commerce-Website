"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "lib/contexts/auth-context"; // Adjust the import path as necessary
import { LoadingSpinner } from "components/loading-spinner"; // Adjust the import path as necessary

interface WithAuthOptions {
  requireAdmin?: boolean; // Indicates if admin access is required
  redirectTo?: string; // URL to redirect to if not authenticated
  allowIfAuthed?: boolean; // Indicates if authenticated users should be allowed
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
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading) {
        // Handle authentication requirements
        if (!user && !options.allowIfAuthed) {
          router.push(options.redirectTo || "/login");
          return;
        }

        // Handle admin requirements
        if (options.requireAdmin && !isAdmin) {
          router.push("/");
          return;
        }

        // Handle redirect if already authenticated
        if (options.allowIfAuthed && user) {
          router.push(options.redirectTo || "/");
          return;
        }
      }
    }, [user, isAdmin, isLoading, router]);

    // Show loading state
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Handle authentication requirements
    if (!user && !options.allowIfAuthed) {
      return null;
    }

    // Handle admin requirements
    if (options.requireAdmin && !isAdmin) {
      return null;
    }

    // Handle redirect if already authenticated
    if (options.allowIfAuthed && user) {
      return null;
    }

    // Log the current pathname for debugging
    console.log(`Current pathname: ${pathname}`);

    // Render the protected component
    return <WrappedComponent {...props} />;
  };
}
