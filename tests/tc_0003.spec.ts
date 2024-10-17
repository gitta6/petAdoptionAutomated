import { test, expect, Page } from '@playwright/test';
import testData from './tc_0003.json'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var dummyEmailIncorrect = testData.dummyEmailIncorrect;
var dummyEmailCorrect = testData.dummyEmailCorrect;
var dummyPassword = testData.dummyPassword;
var testUserEmail = process.env.TEST_USER_EMAIL as string;
var incorrectPassword = testData.incorrectPassword;
var testUserPassword = process.env.TEST_USER_PASSWORD as string;
var testUserName = process.env.TEST_USER_NAME as string;
var testAdminUserEmail = process.env.TEST_ADMIN_USER_EMAIL as string;
var testAdminUserPassword = process.env.TEST_ADMIN_USER_PASSWORD as string;
var testAdminUserName = process.env.TEST_ADMIN_USER_NAME as string;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0003', async ({ }, testInfo) => {
  await test.step('Step 1: Open PetAdoption.', async () => {
    await page.goto('http://localhost:4200/');

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

  await test.step('Step 3: Enter a dummy email address with a wrong format and click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').click();
    await page.getByPlaceholder('Email').pressSequentially(dummyEmailIncorrect, { timeout: 500 });
    await delay(1000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid.' })).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
  });

  await test.step('Step 4: Clear the email field.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').fill('');

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
  });

  await test.step('Step 5: Enter a dummy email address again, but with a correct format.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').pressSequentially(dummyEmailCorrect, { timeout: 500 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
  });

  await test.step('Step 6: Enter any password in the password field.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').pressSequentially(dummyPassword, { timeout: 500 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
  });

  await test.step('Step 7: Click on the "LOGIN" button.', async () => {
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Failed').first()).toBeVisible();
    await expect(page.getByText('Incorrect username or password!')).toBeVisible();
  });

  await test.step('Step 8: Clear the password field.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').fill('');

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
  });

  await test.step('Step 9: Enter a valid email address of a test account that does not have admin rights.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').fill('');
    await page.getByPlaceholder('Email').pressSequentially(testUserEmail, { timeout: 500 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).toBeVisible();
  });

  await test.step('Step 10: Enter an incorrect password in the password field. Click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').pressSequentially(incorrectPassword, { timeout: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Failed').first()).toBeVisible();
    await expect(page.getByText('Incorrect username or password!')).toBeVisible();
  });

  await test.step('Step 11: Now enter the correct passsword for the selected test account. Click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByPlaceholder('Password').pressSequentially(testUserPassword, { timeout: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 12: Click on the name of the logged in user at the top left corner.', async () => {
    await page.getByRole('link', { name: testUserName }).first().click();

    await expect(page.getByRole('link', { name: 'Upload a Pet' }).first()).toBeVisible();
    await expect(page.getByText('Sign Out').first()).toBeVisible();
  });

  await test.step('Step 13: Select "Sign Out".', async () => {
    await page.getByText('Sign Out').first().click();
    await delay(3000);

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: testUserName }).first()).not.toBeVisible();
  });

  await test.step('Step 14: Click on "Login" on the top left. ', async () => {
    await page.getByRole('link', { name: 'Login' }).first().click();

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  await test.step('Step 15: Enter a valid email address of a test account that has admin rights. \
    Then, enter the correct password for the selected test account and click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').pressSequentially(testAdminUserEmail, { timeout: 500 });
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').pressSequentially(testAdminUserPassword, { timeout: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testAdminUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 16: Select "Sign Out" again.', async () => {
    await page.getByRole('link', { name: testAdminUserName }).first().click();
    await page.getByText('Sign Out').first().click();
    await delay(3000);

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: testAdminUserName }).first()).not.toBeVisible();
  });
});
