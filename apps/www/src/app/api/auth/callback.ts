import { Magic } from '@magic-sdk/admin';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Magic as MagicClient } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth2';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Initialize Magic Admin SDK
const magic = new Magic(process.env.MAGIC_SECRET_KEY!);

// Initialize Magic Client SDK
const createMagicClient = () => {
  return new MagicClient(process.env.NEXT_PUBLIC_MAGIC_API_KEY!, {
    extensions: [new OAuthExtension()],
  });
};

export async function GET() {
  try {
    // Get the Magic OAuth result
    const magicClient = createMagicClient();
    const result = await magicClient.oauth2.getRedirectResult();

    // Validate the DID token
    const didToken = result.magic.idToken;
    magic.token.validate(didToken);

    // Get user info from Magic
    const userMetadata = await magic.users.getMetadataByToken(didToken);

    // Create a JWT with user info
    const jwt = await new SignJWT({
      sub: userMetadata.issuer!,
      email: userMetadata.email || undefined,
      publicAddress: userMetadata.publicAddress || undefined,
      isAdmin: false // Will be checked against env whitelist in worker
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set the JWT in a secure cookie
    const cookieStore = cookies();
    cookieStore.set('auth_token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Create user profile in Cloudflare API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        username: userMetadata.email?.split('@')[0] || `user_${Date.now()}`,
        email: userMetadata.email,
        profileData: {
          issuer: userMetadata.issuer,
          publicAddress: userMetadata.publicAddress
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create user profile');
    }

    const { data: profile } = await response.json();


    // Redirect to app
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_HOST));
  } catch (error) {
    console.error('OAuth callback error:', error);
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL('/auth/email?error=Authentication failed', process.env.NEXT_PUBLIC_HOST)
    );
  }
}
