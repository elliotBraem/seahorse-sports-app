import { expect, test } from "@playwright/test";
import { setupAuthState } from "../utils/auth";

test.describe("Authentication", () => {
  test.describe("User is unauthenticated", () => {
    test.use({
      storageState: "storage-states/user-not-connected.json",
    });

    test("should navigate to home page if unauthenticated and navigating to /quests", async ({
      page,
    }) => {
      // Try to navigate to /quests
      await page.goto("/quests");
      await page.waitForLoadState("networkidle");

      // Expect to be redirected to home page
      await expect(page).toHaveURL("/", { timeout: 10000 });
    });
  });

  test.describe("User is authenticated", () => {
    test("should navigate to /onboarding when authenticated and no profile", async ({
      page,
      context,
    }) => {
      const authState = await setupAuthState({
        userId: "test-user-no-profile",
        email: "test@example.com",
      });
      await context.addCookies(authState.cookies);

      // Navigate and wait for app to be ready
      await page.goto("/quests");
      await page.waitForLoadState("domcontentloaded");

      // Expect to redirect to /onboarding page
      await expect(page).toHaveURL("/onboarding", { timeout: 10000 });
    });

    test("should not redirect when authenticated and profile found", async ({
      page,
      context,
    }) => {
      const authState = await setupAuthState({
        userId: "test-user-id",
        email: "test@example.com",
      });
      await context.addCookies(authState.cookies);

      // Navigate and wait for app to be ready
      await page.goto("/quests");
      await page.waitForLoadState("domcontentloaded");

      // Expect to stay on quests page
      await expect(page).toHaveURL("/quests", { timeout: 10000 });
    });
  });
});
