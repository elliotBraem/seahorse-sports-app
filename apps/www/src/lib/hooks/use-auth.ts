import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { magic } from "../magic";
import { useEffect } from "react";

export function useAuth() {
  const router = useRouter();
  const { connectWallet, disconnectWallet, setUser } = useAuthStore();

  useEffect(() => {
    // Check for OAuth redirect result
    const handleOAuthResult = async () => {
      try {
        const result = await magic.oauth2.getRedirectResult();
        if (result) {
          const { oauth, magic: magicData } = result;
          // Connect wallet and set user data
          await connectWallet();
          setUser({
            id: magicData.userMetadata.publicAddress || "",
            username: oauth.userInfo.name || "Anonymous",
            email: magicData.userMetadata.email || "",
            avatar: oauth.userInfo.picture || null,
            profileData: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("OAuth result handling failed:", error);
      }
    };

    handleOAuthResult();
  }, [connectWallet, setUser]);

  const login = async () => {
    try {
      await magic.oauth2.loginWithRedirect({
        provider: "google",
        redirectURI: `${window.location.origin}/`,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await magic.user.logout();
      await disconnectWallet();
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
