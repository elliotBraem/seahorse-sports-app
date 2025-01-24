import { OAuthExtension } from '@magic-ext/oauth2';
import { Magic, MagicUserMetadata, RPCError, RPCErrorCode } from "magic-sdk";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";



export function useAuth() {
  const router = useRouter();
  const { disconnectWallet } = useAuthStore();
  const magic = createMagic();

  const login = async () => {
    try {

      if (magic) {
        const didToken = await magic.oauth2.loginWithRedirect({ provider: "google", redirectURI: "http://localhost:3000" });
      }
      // await connectWallet();
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
  };

  // Call this upon redirect back to application
  const handleOAuthResult = async () => {
    // if v1, use oauth module
    if (magic) {
      const result = await magic.oauth2.getRedirectResult();
      console.log(`OAuth result: ${result}`);

    }

    // Handle result information as needed
  }

  const logout = async () => {
    try {
      if (magic) {
        await magic.user.logout();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    login,
    logout,
    ...useAuthStore(),
  };
}
