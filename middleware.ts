import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, refreshToken } from '@/lib/auth/jwt';
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
import { csrfMiddleware } from '@/lib/middleware/csrf';

export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  // Apply CSRF protection
  const csrfResponse = csrfMiddleware(request);
  if (csrfResponse) return csrfResponse;

  // Exclude public paths from authentication
  const publicPaths = ['/login', '/register', '/', '/products', '/categories'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Get tokens from cookies
  const accessToken = request.cookies.get('access-token')?.value;
  const refreshTokenValue = request.cookies.get('refresh-token')?.value;

  // Allow public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Verify access token
    if (accessToken) {
      const verified = await verifyToken(accessToken);
      
      // Check user role for admin routes
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (verified.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      const response = NextResponse.next();
      
      // Set security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      
      return response;
    }

    // Try to refresh token
    if (refreshTokenValue) {
      try {
        const newAccessToken = await refreshToken(refreshTokenValue);
        const response = NextResponse.next();
        
        // Set new access token
        response.cookies.set({
          name: 'access-token',
          value: newAccessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 // 15 minutes
        });
        
        return response;
      } catch (error) {
        return redirectToLogin(request);
      }
    }

    return redirectToLogin(request);
  } catch (error) {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('access-token');
  response.cookies.delete('refresh-token');
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};