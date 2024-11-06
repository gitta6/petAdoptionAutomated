import { test, expect, Page } from '@playwright/test';
import testData from './tc_0004.json';
import randomstring from 'randomstring';
import sharedData from './sharedData.json';

let context;
let page: Page;

var dummyName = testData.dummyName + randomstring.generate(4);
var dummyEmailIncorrect = testData.dummyEmailIncorrect;
var dummyEmailCorrect = (randomstring.generate(4) + testData.dummyEmailCorrect).toLocaleLowerCase();
var dummyPassword = testData.dummyPassword + randomstring.generate(5);
var dummyAddress = testData.dummyAddress + ' ' + randomstring.generate(5);
var petName = testData.petName;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0004', async ({ }, testInfo) => {
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

  await test.step('Step 4: Click on the "Register" button.', async () => {
    await page.getByRole('button', { name: 'Register' }).click();

    for (let i = 0; i < 5; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(5)).not.toBeVisible();
  });

  await test.step('Step 5: Enter 4 characters in the "Name" field (can be random letters).', async () => {
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').pressSequentially(randomstring.generate(4), { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(4)).not.toBeVisible();
  });

  await test.step('Step 6: Now enter 1 more character in the "Name" field.', async () => {
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').pressSequentially(randomstring.generate(1));

    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(4)).not.toBeVisible();
  });

  await test.step('Step 7: Now enter a dummy name in the "Name" field that is longer than 4 characters.', async () => {
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill('');
    await page.getByPlaceholder('Name').pressSequentially(dummyName, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    for (let i = 0; i < 4; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(4)).not.toBeVisible();
  });

  await test.step('Step 8: In the "Email" field, enter a test email address with a wrong format.', async () => {
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').pressSequentially(dummyEmailIncorrect, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(3)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 9: Now enter a dummy email address with the correct format.', async () => {
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('');
    await page.getByPlaceholder('Email').pressSequentially(dummyEmailCorrect, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    for (let i = 0; i < 3; i++) {
      await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(i)).toBeVisible();
    };
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(3)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 10: In the "Password" field, enter 5 characters (can be random letters, numbers, symbols, etc.)', async () => {
    await page.getByPlaceholder('Password').first().click();
    await page.getByPlaceholder('Password').first().pressSequentially(randomstring.generate(5), { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(1)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 11: Now in the "Password" field, enter any password that is longer than 5 characters.', async () => {
    await page.getByPlaceholder('Password').first().click();
    await page.getByPlaceholder('Password').first().fill('');
    await page.getByPlaceholder('Password').first().pressSequentially(dummyPassword, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(1)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 12: In the "Password again" field, enter any password, but not the same as in the previous step.', async () => {
    await page.getByPlaceholder('Password again').first().click();
    await page.getByPlaceholder('Password again').first().pressSequentially(randomstring.generate(7), { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(1)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 13: In the "Password again" field, enter the same password as in Step 11.', async () => {
    await page.getByPlaceholder('Password again').first().click();
    await page.getByPlaceholder('Password again').first().fill('');
    await page.getByPlaceholder('Password again').first().pressSequentially(dummyPassword, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).not.toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(1)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 14: In the "Address" field, enter 2 characters (can be random letters).', async () => {
    await page.getByPlaceholder('Address').first().click();
    await page.getByPlaceholder('Address').first().pressSequentially(randomstring.generate(2), { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Address")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
  });

  await test.step('Step 15: Now enter any location in the "Address" field that has 3 or more characters.', async () => {
    await page.getByPlaceholder('Address').first().click();
    await page.getByPlaceholder('Address').first().fill('');
    await page.getByPlaceholder('Address').first().pressSequentially(dummyAddress, { timeout: 300 });

    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password again")]//input-validation').filter({ hasText: 'The two passwords do not match!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Address")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
    await expect(page.locator('input-container').filter({ hasText: 'Enter a value!' }).locator('input-validation').nth(0)).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Name")]//input-validation').filter({ hasText: 'This value needs to be longer.' })).not.toBeVisible();
 
  });

  await test.step('Step 16: Click on "Register".', async () => {
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Register successful!').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + dummyName)).toBeVisible();
  });


  await test.step('Step 17: Click on any of the pets listed.', async () => {
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

  await test.step('Step 18: Click on the "Add to favorites!" button.', async () => {
    await page.getByRole('button', { name: 'Add to favorites!' }).click();

    await expect(page.getByText('This pet is one of your favorites! ♥').first()).toBeVisible();
    await expect(page.getByText('To remove, go to your Favorites page.')).toBeVisible();
  });

  await test.step('Step 19: Click on the "Adopt!" button.', async () => {
    await page.getByRole('button', { name: 'Adopt!' }).click();

    await expect(page.getByRole('heading', { name: 'Thank You for Adopting!' }).first()).toBeVisible();
    await expect(page.getByText('Owner\'s Name:').first()).toBeVisible();
    await expect(page.getByText('Owner\'s Phone Number:').first()).toBeVisible();
    await expect(page.locator("//div[contains(@class, 'adoption-dialog')]").first()).toBeVisible();
  });

  await test.step('Step 20: Click on "Close".', async () => {
    await page.getByRole('button', { name: 'Close' }).first().click();

    await expect(page.getByRole('heading', { name: 'Thank You for Adopting!' }).first()).not.toBeVisible();
    await expect(page.getByText('Owner\'s Name:').first()).not.toBeVisible();
    await expect(page.getByText('Owner\'s Phone Number:').first()).not.toBeVisible();
    await expect(page.locator("//div[contains(@class, 'adoption-dialog')]").first()).not.toBeVisible();
  });
});
