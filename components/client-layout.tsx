"use client";

import { ShoppingCart, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AppProvider } from "@/lib/providers/AppProvider";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                AndikaShop
              </Link>
              <nav className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/cart">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon">
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/account">
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </header>
          <Suspense fallback={<LoadingSpinner />}>
            <main className="flex-1">{children}</main>
          </Suspense>
          <Footer />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}
