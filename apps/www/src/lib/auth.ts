import { OAuthExtension } from "@magic-ext/oauth2";
import { Magic, MagicUserMetadata, RPCError, RPCErrorCode } from "magic-sdk";

interface OAuthRedirectResult {
  magic: {
    idToken: string;
    userMetadata: MagicUserMetadata;
  },
  oauth: {
    provider: string;
    scope: string[];
    accessToken: string;
    userHandle: string;
  }
};

const MAGIC_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MAGIC_API_KEY!

const createMagic = (key: string) => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  return typeof window !== 'undefined' && new Magic(key, {
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
    await handleLogin(() => magic.oauth2.loginWithRedirect({ provider: "google", redirectURI: "http://localhost:3000" }));
  }
}