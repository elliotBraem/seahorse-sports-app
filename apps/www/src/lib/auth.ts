import { OAuthExtension } from "@magic-ext/oauth2";
import { Magic, RPCError, RPCErrorCode } from "magic-sdk";

// Build the key into the client
const MAGIC_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MAGIC_API_KEY!
const APP_ORIGIN = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
let CALLBACK_URL = APP_ORIGIN + "/api/auth/callback";

const createMagic = (key: string) => {
  // We make sure that the window object is available
  if (typeof window !== 'undefined') {
    CALLBACK_URL = `${window.location}/api/auth/callback`;
  }

  // Then we create a new instance of Magic using a publishable key
  return new Magic(key, {
    extensions: [new OAuthExtension()],
  });
};

const handleLogin = async (loginFn: Function) => {
  try {
    return await loginFn();
  } catch (error) {
    if (error instanceof RPCError) {
      switch (error.code) {
        case RPCErrorCode.MagicLinkFailedVerification:
        case RPCErrorCode.MagicLinkExpired:
        case RPCErrorCode.MagicLinkRateLimited:
        case RPCErrorCode.UserAlreadyLoggedIn:
        case RPCErrorCode.AccessDeniedToUser:
        case RPCErrorCode.UserAlreadyLoggedIn:
          // handle errors
          break;
      }
    }
    console.error("Login failed:", error);
  }
}

export async function loginWithGoogle() {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    await handleLogin(() => magic.oauth2.loginWithRedirect({ provider: "google", redirectURI: CALLBACK_URL }));
  }
}

export async function loginWithEmail(email: string) {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    // Log in using our email with Magic and store the returned DID token in a variable
    const didToken = await magic.auth.loginWithMagicLink({ email });

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${didToken}`,
      },
    });

    if (res.ok) {
      const userMetadata = await magic.user.getMetadata();
      // setUser(userMetadata );
      // router.push('/dashboard');
    }
  }
}

export async function loginWithPhoneNumber(phoneNumber: string) {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    // Log in using phone number with Magic and store the returned DID token
    const didToken = await magic.auth.loginWithSMS({ phoneNumber });

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${didToken}`,
      },
    });

    if (res.ok) {
      const userMetadata = await magic.user.getMetadata();
    }
  }
}

export async function getCurrentUserInfo() {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    return await magic.user.getInfo();
  }
}

export async function isLoggedIn() {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    return await magic.user.isLoggedIn();
  }
}

export async function logout() {
  const magic = createMagic(MAGIC_PUBLISHABLE_KEY);
  if (magic) {
    return await magic.user.logout();
  }
}
