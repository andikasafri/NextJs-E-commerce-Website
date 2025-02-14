import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

/**
 * Verifies a JWT token and returns the payload if valid.
 *
 * @param token - The JWT token to verify.
 * @returns The payload of the verified token.
 * @throws Error if the token is invalid.
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw new Error("Invalid token");
  }
}

/**
 * Refreshes a JWT token by verifying the existing token and creating a new access token.
 *
 * @param token - The JWT token to refresh.
 * @returns A new access token.
 * @throws Error if the refresh token is invalid.
 */
export async function refreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Create new access token
    return await createAccessToken({
      userId: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
    });
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error("Invalid refresh token");
  }
}

/**
 * Creates a new access token with the given payload.
 *
 * @param payload - The payload to include in the token.
 * @returns The newly created access token.
 */
export async function createAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
}) {
  return await new SignJWT({
    ...payload,
    jti: nanoid(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

/**
 * Creates a new refresh token with the given payload.
 *
 * @param payload - The payload to include in the token.
 * @returns The newly created refresh token.
 */
export async function createRefreshToken(payload: {
  userId: string;
  email: string;
  role: string;
}) {
  return await new SignJWT({
    ...payload,
    jti: nanoid(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}
