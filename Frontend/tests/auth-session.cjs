const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const baseURL = process.env.TEST_BASE_URL || "http://localhost:3000";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_EXECUTABLE,
    headless: true,
  });
  try {
    for (const acceptsCookie of [false, true]) {
      const context = await browser.newContext();
      await context.addInitScript(() => {
        if (!sessionStorage.getItem("seeded")) {
          localStorage.setItem("userId", "stale-user");
          sessionStorage.setItem("seeded", "yes");
        }
      });
      let loggedIn = false,
        posts = 0;
      await context.route("**/api/**", async (route) => {
        const url = new URL(route.request().url());
        if (url.pathname === "/api/auth/login") {
          posts++;
          if (acceptsCookie) {
            await context.addCookies([
              {
                name: "access_token",
                value: "test-session",
                url: baseURL,
                httpOnly: true,
                sameSite: "Lax",
              },
            ]);
            loggedIn = true;
          }
          return route.fulfill({
            json: { success: "true", message: "Login successful" },
          });
        }
        if (url.pathname === "/api/auth/user")
          return route.fulfill({
            status: loggedIn ? 200 : 401,
            json: loggedIn
              ? {
                  success: true,
                  data: {
                    id: 1,
                    email: "verified@example.com",
                    firstName: "Verified",
                    maxSpaces: 3,
                    spaceCount: 0,
                  },
                }
              : { success: false, message: "Please sign in" },
          });
        return route.fulfill({ json: { success: true, data: [] } });
      });
      const page = await context.newPage();
      await page.goto(`${baseURL}/auth/signin`, { waitUntil: "networkidle" });
      assert.equal(
        await page.evaluate(() => localStorage.getItem("userId")),
        null,
      );
      assert.equal(await page.getByText("Hi, stale-user").count(), 0);
      await page
        .getByPlaceholder("Email", { exact: true })
        .fill("verified@example.com");
      await page
        .getByPlaceholder("Password", { exact: true })
        .fill("test-password");
      await page
        .getByRole("button", { name: "login with email and password" })
        .click();
      if (acceptsCookie) {
        await page.waitForURL("**/dashboard/overview");
        await page.getByText("Hi, verified", { exact: false }).waitFor();
        await context.clearCookies();
        loggedIn = false;
        await page.evaluate(() => window.dispatchEvent(new Event("focus")));
        await page.waitForURL("**/auth/signin");
        assert.equal(await page.getByText("Hi, verified").count(), 0);
      } else {
        await page
          .getByText("Login could not establish a session.", { exact: false })
          .waitFor();
        assert.ok(page.url().endsWith("/auth/signin"));
        assert.equal(await page.getByText("Hi, verified").count(), 0);
      }
      assert.equal(posts, 1);
      console.log(
        "PASS: stale identity cleared; " +
          (acceptsCookie
            ? "verified login reaches dashboard; session loss redirects and clears header"
            : "missing cookie shows error and stays signed out"),
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
