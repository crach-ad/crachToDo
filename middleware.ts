import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the user is authenticated by looking for a user item in localStorage
  // Note: In a real app, you would use a proper authentication token or cookie

  // For client-side auth, we'll handle most protection in the components themselves
  // This middleware will just handle basic route protection

  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/forgot-password"

  // Check if we're on a public path
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected routes, we'll let the client-side auth handle it
  // In a real app, you would validate a token or session cookie here
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
