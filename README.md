# AndikaShop E-commerce Platform

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://newcontent-three.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/repo-GitHub-blue?style=for-the-badge)](https://github.com/revou-fsse-oct24/milestone-2-andikasafri)

![Application Preview](/public/application-product-page.png)
_Product Listing Page - [View Full Size](/public/application-product-full-page.png)_

![Admin Dashboard](/public/admin-product-page.png)
_Admin Dashboard - [View Full Size](/public/admin-product-full-page.png)_

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Implementations](#key-implementations)
- [Performance](#performance)
- [Build Details](#build-details)
- [Future Roadmap](#future-roadmap)

## Features

- **User System**: Secure authentication with JWT
- **Product Management**: CRUD operations for admins
- **Advanced Cart**: Save for later, bulk actions, discounts
- **Order System**: Checkout process & order history
- **Responsive UI**: Mobile-first design approach
- **Performance**: Code splitting & lazy loading

## Tech Stack

- **Framework**: Next.js 15.1.6
- **Language**: TypeScript 5.0+
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **API**: RESTful integration
- **Deployment**: Vercel

## Installation

```bash
git clone https://github.com/revou-fsse-oct24/milestone-2-andikasafri.git
cd milestone-2-andikasafri
npm install
npm run dev
```

## Project Structure

```text
milestone-2-andikasafri/
├── app/
│   ├── admin/            # Admin dashboard components
│   ├── cart/             # Shopping cart functionality
│   ├── product/          # Product display pages
│   └── ...               # Other route segments
├── components/           # Reusable UI components
├── lib/                  # API clients and utilities
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## Key Implementations

### 1. Advanced State Management

**File**: `lib/store/cart.ts`

```typescript
// Zustand store handling complex cart logic
const useCartStore = create<CartState>((set) => ({
  items: [],
  savedItems: [],
  addItem: (product) => {
    set((state) => ({ items: [...state.items, { product, quantity: 1 }] }));
  },
  // Full cart operations implementation...
}));
```

### 2. Admin Dashboard

**File**: `app/admin/products/page.tsx`

```typescript
// Product management dashboard
export default function ProductsPage() {
  const { products, deleteProduct } = useProductStore();

  return (
    <div className="container mx-auto p-4">
      <DataTable
        columns={productColumns}
        data={products}
        onDelete={deleteProduct}
      />
    </div>
  );
}
```

### 3. Performance Optimization

**File**: `components/ProductGrid.tsx`

```typescript
// Dynamic import with lazy loading
const ProductCard = dynamic(() => import("@/components/ProductCard"), {
  loading: () => <Skeleton className="h-64 w-full" />,
});
```

## Performance

Optimized build output with hybrid rendering:

```text
Route (app)                              Size     First Load JS
├ ● /category/[id]                       33.4 kB         138 kB  # SSG
├ ƒ /admin/products/[id]                 36.1 kB         141 kB  # SSR
└ ○ /products                            22.8 kB         128 kB   # Static
```

## Build Details

```bash
npm run build
▲ Next.js 15.1.6
✓ Collected page data (120 pages)
✓ Static generation for 86 product pages
✓ SSR enabled for admin dashboard
✓ Middleware for auth handling (38.9 kB)
```

## Future Roadmap

- [ ] Product review system
- [ ] Advanced search filters
- [ ] Payment gateway integration
- [ ] CI/CD pipeline implementation

---

**Developed by Andika Safri**  
[![GitHub](https://img.shields.io/badge/GitHub-Profile-lightgrey?style=flat-square)](https://github.com/yourprofile)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Profile-blue?style=flat-square)](https://linkedin.com/in/yourprofile)
