import { test, expect } from "@playwright/test";
import { loginWith, createBlog } from "./helper.js";

test.describe("Blog app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Arto Hellas",
        username: "hellas",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("login form can be opened", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();
    await expect(page.getByText("Log in to application")).toBeVisible();
  });

  test("login succeeds with correct credentials", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");

    await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
  });

  test("login fails with wrong credentials", async ({ page }) => {
    await loginWith(page, "mluukkai", "wrong");

    await expect(page.getByText("wrong username or password")).toBeVisible();
    await expect(page.getByText("Matti Luukkainen logged in")).not.toBeVisible();
  });

  test.describe("when logged in", () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "a blog created by playwright", "Playwright", "https://playwright.dev");

      await expect(
        page.getByRole("link", { name: "a blog created by playwright" }),
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "a blog to like", "Playwright", "https://playwright.dev");

      await page.getByRole("link", { name: "a blog to like" }).click();
      await expect(page.getByText("0 likes")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("1 likes")).toBeVisible();
    });

    test("the user who added a blog can delete it", async ({ page }) => {
      await createBlog(page, "a blog to remove", "Playwright", "https://playwright.dev");

      await page.getByRole("link", { name: "a blog to remove" }).click();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByRole("link", { name: "a blog to remove" }),
      ).not.toBeVisible();
    });

    test("only the creator sees the delete button", async ({ page }) => {
      await createBlog(page, "someone elses blog", "Playwright", "https://playwright.dev");

      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, "hellas", "salainen");

      await page.getByRole("link", { name: "someone elses blog" }).click();

      await expect(page.getByRole("button", { name: "like" })).toBeVisible();
      await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();
    });
  });
});
