import { SignJWT } from "jose";

const TEST_JWT_SECRET = "your_jwt_secret_key";

interface CreateTestTokenOptions {
  userId?: string;
  email?: string;
  isAdmin?: boolean;
}

export async function createTestToken({
  userId = "test-user-id",
  email = "test@example.com",
  isAdmin = false,
}: CreateTestTokenOptions = {}) {
  const token = await new SignJWT({
    sub: userId,
    email,
    isAdmin,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(TEST_JWT_SECRET));

  return token;
}

export async function setupAuthState(options: CreateTestTokenOptions = {}) {
  return setupTokenState(options);
}

export async function setupAdminAuthState(options: Omit<CreateTestTokenOptions, 'isAdmin'> = {}) {
  return setupTokenState({ ...options, isAdmin: true });
}

async function setupTokenState(options: CreateTestTokenOptions = {}) {
  const token = await createTestToken(options);
  
  return {
    cookies: [
      {
        name: "auth_token",
        value: token,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax" as const
      }
    ],
    origins: [
      {
        origin: "http://localhost:3000",
        localStorage: []
      }
    ]
  };
}
