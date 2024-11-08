import { test, expect, Page } from '@playwright/test';
import testData from './tc_0002.json';
import sharedData from './sharedData.json';

let context;
let page: Page;

var petName = testData.petName;
var petName2 = testData.petName2;
var petArray: string[] = testData.petArray;
var petArray2: string[] = testData.petArray2;
var petArray3: string[] = testData.petArray3;
var location = testData.location;
var petName3 = testData.petName3;
var breed = testData.breed;
var petName4 = testData.petName4;
var petArray4: string[] = testData.petArray4;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0002', async ({ }, testInfo) => {
  await test.step('Step 1: Open PetAdoption.', async () => {
    await page.goto(pageUrl);

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 2: Click on "Search for pets…" then enter a name of any Pet that is \
    displayed on the home screen. Click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially(petName, { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    await expect(page.getByRole('link', { name: petName }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(1)).not.toBeVisible();
  });

  await test.step('Step 3: Navigate to the home page by clicking on the "PetAdoption" label on the top right.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 4: Click on the search bar again, then type in a name of any other Pet \
    that is displayed on the home screen. After that, press "Enter".', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially(petName2, { delay: 500 });
    await page.getByPlaceholder('Search for pets...').press('Enter');

    await expect(page.getByRole('link', { name: petName2 }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(1)).not.toBeVisible();
  });

  await test.step('Step 5: Click on the search bar again, but this time, enter "Female", \
    then click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially('Female', { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    for (let i = 0; i < petArray.length; i++) {
      await expect(page.getByRole('link', { name: petArray[i] }).first()).toBeVisible();
      await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(i)).toBeVisible();
    }
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(petArray.length)).not.toBeVisible();
  });

  await test.step('Step 6: Click on the search bar again, but this time, enter "Dog", \
    then click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially('Dog', { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    for (let i = 0; i < petArray2.length; i++) {
      await expect(page.getByRole('link', { name: petArray2[i] }).first()).toBeVisible();
      await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(i)).toBeVisible();
    }
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(petArray2.length)).not.toBeVisible();
  });

  await test.step('Step 7: Select "Cat" as category.', async () => {
    await page.getByRole('link', { name: 'Cat (', exact: false }).click();

    await expect(page.getByPlaceholder('Search for pets...')).toBeEmpty();
    for (let i = 0; i < petArray3.length; i++) {
      await expect(page.getByRole('link', { name: petArray3[i] }).first()).toBeVisible();
      await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(i)).toBeVisible();
    }
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(petArray3.length)).not.toBeVisible();
  });

  await test.step('Step 8: Click on the search bar again, and enter any location \
    that returns a result. Click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially(location, { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    await expect(page.getByRole('link', { name: petName3 }).first()).toBeVisible();
    await expect(page.getByText(location).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(1)).not.toBeVisible();
  });

  await test.step('Step 9: Click on the search bar again, and enter any breed \
    that returns a result (e.g. Maine Coon). Click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially(breed, { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    await expect(page.getByRole('link', { name: petName4 }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(1)).not.toBeVisible();
  });

  await test.step('Step 10: Click on the search bar again, and enter "Rabbit". Click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially('Rabbit', { delay: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    for (let i = 0; i < petArray4.length; i++) {
      await expect(page.getByRole('link', { name: petArray4[i] }).first()).toBeVisible();
      await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(i)).toBeVisible();
    }
    await expect(page.locator('//ul[contains(@placeholder, "results")]//li').nth(petArray4.length)).not.toBeVisible();
  });
  /* */
});
