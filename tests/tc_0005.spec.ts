import { test, expect, Page } from '@playwright/test';
import testData from './tc_0005.json';
import sharedData from './sharedData.json';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var testUserEmail = process.env.TEST_USER_EMAIL as string;
var testUserPassword = process.env.TEST_USER_PASSWORD as string;
var testUserName = process.env.TEST_USER_NAME as string;
var petArray: string[] = testData.petArray;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0005', async ({ }, testInfo) => {
  await test.step('Step 1: Open PetAdoption.', async () => {
    await page.goto(pageUrl);

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 2: Click on "Login" on the top left.', async () => {
    await page.getByRole('link', { name: 'Login' }).first().click();

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  await test.step('Step 3: Enter a valid email address of a test account that does not have admin rights.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').fill('');
    await page.getByPlaceholder('Email').pressSequentially(testUserEmail, { delay: 500 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
  });

  await test.step('Step 4: Enter the correct password for the selected test account. Click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByPlaceholder('Password').pressSequentially(testUserPassword, { delay: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 5: Click on "Favorites" on the menu bar. ', async () => {
    await page.getByRole('link', { name: 'Favorites' }).first().click();

    await expect(page.getByRole('heading', { name: 'Favorite pets' }).first()).toBeVisible();
  });

  await test.step('Step 6: If there are pets listed, remove all of them.', async () => {
    await delay(2000);
    if (await page.locator("//span[contains(@class, 'ng-star-inserted')]").first().isVisible() == true) {
      var favoritesQuantityString = await page.locator("//span[contains(@class, 'ng-star-inserted')]").first().innerText();
      var favoritesQuantity = parseInt(favoritesQuantityString);
      for (let i = 0; i < favoritesQuantity; i++) {
        await page.locator("//button[contains(@class, 'remove-button')]").first().click();
        await delay(1500);
      };
    }
    await expect(page.getByText('No Favorites!').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go To Homepage!' })).toBeVisible();
  });

  await test.step('Step 7: Click on "Go To Homepage!"', async () => {
    await page.getByRole('link', { name: 'Go To Homepage!' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 8: Click on "Favorites" on the menu bar again. ', async () => {
    await page.getByRole('link', { name: 'Favorites' }).first().click();

    await expect(page.getByRole('heading', { name: 'Favorite pets' }).first()).toBeVisible();
    await expect(page.getByText('No Favorites!').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go To Homepage!' })).toBeVisible();
  });

  await test.step('Step 9: Navigate to the home page by clicking on the "PetAdoption" label on the top right.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 10: Select any 5 of the pets and add them to Favorites by clicking on their picture, then clicking on "Add to favorites!"', async () => {
    for (let i = 0; i < 5; i++) {
      await page.getByRole('link', { name: petArray[i] }).first().click();
      await page.getByRole('button', { name: 'Add to favorites!' }).click();
      await expect(page.getByText('This pet is one of your favorites! ♥').first()).toBeVisible();
      await expect(page.getByText('To remove, go to your Favorites page.').first()).toBeVisible();
      if (i!=4) {
        await page.getByRole('link', { name: 'Pet Adoption' }).first().click();  
      };
    };
    await delay(1000);
  });

  await test.step('Step 11: Click on "Favorites" on the menu bar again. ', async () => {
    await page.getByRole('link', { name: 'Favorites' }).first().click();

    await expect(page.getByRole('heading', { name: 'Favorite pets' }).first()).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await expect(page.getByRole('link', { name: petArray[i]}).first()).toBeVisible();      
    };
    await expect((await page.locator("//div[contains(@class, 'pets-count')]").first().innerText()).toString()).toContain(" 5");
    await expect((await page.locator("//span[contains(@class, 'ng-star-inserted')]").first().innerText()).toString()).toEqual("5");
  });

  await test.step('Step 12: Remove one of the pets from Favorites. ', async () => {
    await page.locator('li').filter({ hasText: petArray[0] + ' Remove from favorites' }).getByRole('button').first().click();

    await delay(2000);
    await expect(page.getByRole('link', { name: petArray[0]}).first()).not.toBeVisible();      
    await expect((await page.locator("//div[contains(@class, 'pets-count')]").first().innerText()).toString()).toContain(" 4");
    await expect((await page.locator("//span[contains(@class, 'ng-star-inserted')]").first().innerText()).toString()).toEqual("4");
  });

  await test.step('Step 13: Refresh the page.', async () => {
    await page.reload();

    await delay(2000);
    await expect(page.getByRole('heading', { name: 'Favorite pets' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: petArray[0]}).first()).not.toBeVisible();      
    await expect((await page.locator("//div[contains(@class, 'pets-count')]").first().innerText()).toString()).toContain(" 4");
    await expect((await page.locator("//a[contains(@routerLink, '/favorites-page')]//span[contains(text(), '4')]").first())).toBeVisible();
  });

  await test.step('Step 14: Remove all pets from Favorites.', async () => {
    for (let i = 0; i < 4; i++) {
      await page.locator("//button[contains(@class, 'remove-button')]").first().click();
      await delay(1500);
    };

    await expect(page.getByText('No Favorites!').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go To Homepage!' })).toBeVisible();
  });
});
