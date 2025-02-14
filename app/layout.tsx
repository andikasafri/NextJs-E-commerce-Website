import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { ClientLayout } from "@/components/client-layout";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AndikaShop - Your Premium Shopping Destination",
  description: "Discover a wide range of premium products at AndikaShop",
  keywords: "ecommerce, shopping, online store",
  authors: [{ name: "AndikaShop Team" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
