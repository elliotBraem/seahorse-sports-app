import { expect, test } from "@playwright/test";
import { setupAuthState } from "../utils/auth";

test.describe("Social Follow Quest", () => {
  test.describe("User is authenticated with profile", () => {
    test("should complete social follow quest successfully", async ({
      page,
      context,
    }) => {
      // Set up authenticated state with profile
      const authState = await setupAuthState({
        userId: "test-user-id",
        email: "test@example.com",
      });
      await context.addCookies(authState.cookies);

      // Navigate to quests page and wait for content
      await page.goto("/quests");
      await page.waitForLoadState("domcontentloaded");

      // Store initial points for comparison
      const initialPoints = await page.getByTestId("user-points").textContent();

      // Find and click the social follow quest button
      const followButton = page.getByRole("button", { name: "Follow"});
      await expect(followButton).toBeVisible();

      // Create a promise to wait for new page/popup
      const popupPromise = context.waitForEvent("page");
      
      // Click the follow button
      await followButton.click();

      // Wait for the new page/popup and verify it opened
      const popup = await popupPromise;
      expect(popup.url()).toContain("x.com");

      // Wait for and verify the success toast
      const toast = page.getByText("Quest Completed!").first();
      await expect(toast).toBeVisible();

      // // Verify points were updated in header
      // const updatedPoints = await page.getByTestId("user-points").textContent();
      // expect(Number(updatedPoints)).toBe(Number(initialPoints) + 100);

      // Verify the button is now disabled
      await expect(followButton).toBeDisabled();
    });
  });
});
