import { test, expect, Page } from '@playwright/test';
import testData from './tc_0001.json';
import sharedData from './sharedData.json';

let context;
let page: Page;

var petName = testData.petName;
var petName2 = testData.petName2;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0001', async ({ }, testInfo) => {
  await test.step('Step 1: Open PetAdoption.', async () => {
    await page.goto(pageUrl);

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
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

  await test.step('Step 3: Click on the "Register here" link under the green "LOGIN" button.', async () => {
    await page.getByRole('link', { name: 'Register here' }).first().click();

    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByPlaceholder('Name')).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Password again', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Address')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In!' })).toBeVisible();
  });

  await test.step('Step 4: Click on the "Sign In!" link under the green "Register" button.', async () => {
    await page.getByRole('link', { name: 'Sign In!' }).first().click();

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  await test.step('Step 5: Navigate to the home page by clicking on the "PetAdoption" label on the top right.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
  });

  await test.step('Step 6: Click on "Favorites" on the menu bar.', async () => {
    await page.getByRole('link', { name: 'Favorites' }).first().click();

    await expect(page.getByText('No Favorites!').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go To Homepage!' })).toBeVisible();
    await expect(page.locator('li').filter({ hasText: 'Remove from favorites' }).getByRole('button').first()).not.toBeVisible();
  });

  await test.step('Step 7: Click on "Go To Homepage!".', async () => {
    await page.getByRole('link', { name: 'Go To Homepage!' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 8: Click on any of the pets listed.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByText(petName + ' is ')).toBeVisible();
    await expect(page.getByText(' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species:')).toBeVisible();
    await expect(page.getByText('Breed:')).toBeVisible();
    await expect(page.getByText('Gender:')).toBeVisible();
    await expect(page.getByText('Color:')).toBeVisible();
    await expect(page.getByText('Location:')).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Categories:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).not.toBeVisible();
  });

  await test.step('Step 9: Navigate to the home page, and click on another pet.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();
    await page.getByRole('link', { name: petName2 }).first().click();

    await expect(page.getByText(petName2 + ' is ')).toBeVisible();
    await expect(page.getByText(' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species:')).toBeVisible();
    await expect(page.getByText('Breed:')).toBeVisible();
    await expect(page.getByText('Gender:')).toBeVisible();
    await expect(page.getByText('Color:')).toBeVisible();
    await expect(page.getByText('Location:')).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Categories:')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).not.toBeVisible();
  });

  await test.step('Step 10: Click on the "Add to favorites!" button.', async () => {
    await page.getByRole('button', { name: 'Add to favorites!' }).click();

    await expect(page.getByText('Login Required').first()).toBeVisible();
    await expect(page.getByText('Adding to favorites is only available to logged in users!')).toBeVisible();
  });

  await test.step('Step 11: Click on the "Adopt!" button.', async () => {
    await page.getByRole('button', { name: 'Adopt!' }).click();

    await expect(page.getByText('Login Required').first()).toBeVisible();
    await expect(page.getByText('Starting an adoption process is only available to logged in users!')).toBeVisible();
  });
});
