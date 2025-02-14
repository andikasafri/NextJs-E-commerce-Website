"use client";

import { withAuth } from "@/lib/hoc/withAuth";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthWishlist } from "@/lib/hooks/use-wishlist";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  User as UserIcon,
  Mail,
  Camera,
  Lock,
  LogOut,
  ShoppingCart,
  Heart,
  Package,
  AlertCircle,
} from "lucide-react";
// Import Badge from your UI components instead of lucide-react
import { Badge } from "@/components/ui/badge";
// Import the cart hook (which uses CartItem internally)
import { useCart } from "@/lib/cart";
// Using Radix UI Switch (or your own implementation)
import { Switch } from "@radix-ui/react-switch";
import { getProduct } from "@/lib/productApi";
import { Product } from "@/lib/types";

//
// MOCK DATA (Orders)
//
const mockOrders = [
  {
    id: "1",
    date: "2024-03-20",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: 1,
        title: "Premium Headphones",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      },
      {
        id: 2,
        title: "Wireless Mouse",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      },
    ],
  },
];

//
// Internal Sub-Components
//

// --- Header Section ---
function ProfileHeader({ user, logout }: { user: any; logout: () => void }) {
  return (
    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <button
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Change Profile Picture"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Mail className="h-4 w-4" />
            {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

// --- Profile Update Form ---
function ProfileTab({
  formData,
  setFormData,
  loading,
  handleProfileUpdate,
}: {
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Password Update Form ---
function PasswordTab({
  formData,
  setFormData,
  loading,
  handlePasswordUpdate,
}: {
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  handlePasswordUpdate: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              <Lock className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Orders Tab (Mock Data) ---
function OrdersTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "delivered" ? "default" : "secondary"
                    }
                    className="mb-2"
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Need Help?
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Wishlist Tab ---
// Uses wishlist data and includes an "Add to Cart" button.
function WishlistTab({
  wishlistProducts,
  removeFromWishlist,
  toast,
}: {
  wishlistProducts: Product[];
  removeFromWishlist: (productId: number) => void;
  toast: (arg: {
    description: string;
    variant?: "default" | "destructive" | null;
  }) => void;
}) {
  // Use the cart hook to add items directly to the cart.
  const { addItem } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Wishlist</CardTitle>
      </CardHeader>
      <CardContent>
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="relative group">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{product.title}</h3>
                  <p className="text-lg font-bold text-primary">
                    ${product.price}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        addItem(product);
                        toast({
                          description: "Added to cart successfully",
                        });
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        removeFromWishlist(product.id);
                        toast({
                          description: "Removed from wishlist",
                        });
                      }}
                    >
                      <Heart className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <Link href="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Preferences Tab ---
function PreferencesTab({
  notifications,
  handleNotificationUpdate,
}: {
  notifications: Record<string, boolean>;
  handleNotificationUpdate: (key: string, value: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive important account notifications via email
            </p>
          </div>
          <Switch
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) =>
              handleNotificationUpdate("emailNotifications", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Order Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about your order status
            </p>
          </div>
          <Switch
            checked={notifications.orderUpdates}
            onCheckedChange={(checked) =>
              handleNotificationUpdate("orderUpdates", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Promotional Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive special offers and promotions
            </p>
          </div>
          <Switch
            checked={notifications.promotionalEmails}
            onCheckedChange={(checked) =>
              handleNotificationUpdate("promotionalEmails", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Newsletter</Label>
            <p className="text-sm text-muted-foreground">
              Subscribe to our weekly newsletter
            </p>
          </div>
          <Switch
            checked={notifications.newsletter}
            onCheckedChange={(checked) =>
              handleNotificationUpdate("newsletter", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

//
// Main Client Component
//
function AccountPageClient() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  // Profile form state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Wishlist state
  const { items: wishlistIds, removeItem: removeWishlistItem } =
    useAuthWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Notification preferences (local state)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotionalEmails: false,
    newsletter: true,
  });

  // Fetch wishlist products when wishlistIds change
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user || wishlistIds.length === 0) {
        setWishlistProducts([]);
        return;
      }
      try {
        const productPromises = wishlistIds.map(async (id) => {
          try {
            const product = await getProduct(id);
            return product;
          } catch (error) {
            console.warn(`Product ${id} not found, removing from wishlist`);
            removeWishlistItem(id);
            return null;
          }
        });
        const products = await Promise.all(productPromises);
        const validProducts = products.filter(
          (product): product is Product => product !== null
        );
        setWishlistProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
        toast({
          variant: "destructive" as const,
          description: "Failed to load wishlist products",
        });
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds, user, toast, removeWishlistItem]);

  // --- Handlers ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
      });
      toast({
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive" as const,
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive" as const,
        description: "Passwords do not match",
      });
      return;
    }
    setLoading(true);
    try {
      // Implement your password update logic here
      toast({
        description: "Password updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive" as const,
        description: "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast({
      description: "Notification preferences updated",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <ProfileHeader user={user} logout={logout} />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            handleProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>

        <TabsContent value="password">
          <PasswordTab
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            handlePasswordUpdate={handlePasswordUpdate}
          />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="wishlist">
          <WishlistTab
            wishlistProducts={wishlistProducts}
            removeFromWishlist={removeWishlistItem}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            notifications={notifications}
            handleNotificationUpdate={handleNotificationUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAuth(AccountPageClient);
