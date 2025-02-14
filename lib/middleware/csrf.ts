import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const CSRF_HEADER = "X-CSRF-Token";
const CSRF_COOKIE = "csrf-token";

/**
 * Generates a new CSRF token.
 *
 * @returns A unique CSRF token.
 */
export function generateCsrfToken() {
  return nanoid(32);
}

/**
 * Validates a CSRF token against a stored token.
 *
 * @param token - The token to validate.
 * @param storedToken - The stored token to compare against.
 * @returns True if the tokens match, otherwise false.
 */
export function validateCsrfToken(token: string, storedToken: string) {
  return token === storedToken;
}

/**
 * Middleware function to check CSRF tokens in requests.
 *
 * @param request - The incoming request object.
 * @returns A NextResponse object with a 403 status if the token is invalid, otherwise null.
 */
export function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET requests
  if (request.method === "GET") {
    return null;
  }

  const csrfToken = request.headers.get(CSRF_HEADER);
  const storedToken = request.cookies.get(CSRF_COOKIE)?.value;

  if (
    !csrfToken ||
    !storedToken ||
    !validateCsrfToken(csrfToken, storedToken)
  ) {
    return new NextResponse("Invalid CSRF Token", { status: 403 });
  }

  return null;
}
