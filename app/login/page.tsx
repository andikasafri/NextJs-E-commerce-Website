"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, isAdmin: boolean) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isAdmin) {
        await login("admin@gmail.com", "admin1234");
        toast({
          description: "Logged in as administrator",
        });
      } else {
        await login(email, password);
        toast({
          description: "Logged in successfully",
        });
      }
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-73px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <Tabs defaultValue="user" key="login-tabs">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">
              <User className="mr-2 h-4 w-4" />
              User Login
            </TabsTrigger>
            <TabsTrigger value="admin">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Login
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  Sign In
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="admin">
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label>Admin Email:</Label>
                    <span className="font-mono">admin@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Password:</Label>
                    <span className="font-mono">admin1234</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Login as Administrator
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
