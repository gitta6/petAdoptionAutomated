import { test, expect, Page } from '@playwright/test';
import testData from './tc_0006.json';
import sharedData from './sharedData.json';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var testUserEmail = process.env.TEST_USER_EMAIL as string;
var testUserPassword = process.env.TEST_USER_PASSWORD as string;
var testUserName = process.env.TEST_USER_NAME as string;
var petName = testData.petName;
var testAdminUserEmail = process.env.TEST_ADMIN_USER_EMAIL as string;
var testAdminUserPassword = process.env.TEST_ADMIN_USER_PASSWORD as string;
var testAdminUserName = process.env.TEST_ADMIN_USER_NAME as string;
var petName2 = testData.petName2;
var petName3 = testData.petName3;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0006', async ({ }, testInfo) => {
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
    await page.getByPlaceholder('Email').pressSequentially(testUserEmail, { delay: 100 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
  });

  await test.step('Step 4: Enter the correct password for the selected test account. Click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByPlaceholder('Password').pressSequentially(testUserPassword, { delay: 100 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
  });

  await test.step('Step 5: Navigate to the homepage, then click on any of the pets.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();

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

  await test.step('Step 6: Click on the name of the logged in user at the top left corner.', async () => {
    await page.getByRole('link', { name: testUserName }).first().click();

    await expect(page.getByRole('link', { name: 'Upload a Pet' }).first()).toBeVisible();
    await expect(page.getByText('Sign Out').first()).toBeVisible();
  });

  await test.step('Step 7: Select "Sign Out".', async () => {
    await page.getByText('Sign Out').first().click();
    await delay(3000);

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: testUserName }).first()).not.toBeVisible();
  });

  await test.step('Step 8: Click on "Login" on the top left again.  ', async () => {
    await page.getByRole('link', { name: 'Login' }).first().click();

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  await test.step('Step 9: Enter a valid email address of a test account that has admin rights. \
    Then, enter the correct password for the selected test account and click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').pressSequentially(testAdminUserEmail, { delay: 100 });
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').pressSequentially(testAdminUserPassword, { delay: 100 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testAdminUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
  });

  await test.step('Step 10: Click on any of the pets listed.', async () => {
    await page.getByRole('link', { name: petName2 }).first().click();

    await expect(page.getByText(petName2 + ' is ')).toBeVisible();
    await expect(page.getByText(' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species:').first()).toBeVisible();
    await expect(page.getByText('Breed:').first()).toBeVisible();
    await expect(page.getByText('Gender:').first()).toBeVisible();
    await expect(page.getByText('Color:').first()).toBeVisible();
    await expect(page.getByText('Location:').first()).toBeVisible();
    await expect(page.getByText('Description:').first()).toBeVisible();
    await expect(page.getByText('Categories:').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).toBeVisible();
  });

  await test.step('Step 11: Navigate to the home page, and click on another pet. ', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();

    await page.getByRole('link', { name: petName3 }).first().click();

    await expect(page.getByText(petName3 + ' is ')).toBeVisible();
    await expect(page.getByText(' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species:').first()).toBeVisible();
    await expect(page.getByText('Breed:').first()).toBeVisible();
    await expect(page.getByText('Gender:').first()).toBeVisible();
    await expect(page.getByText('Color:').first()).toBeVisible();
    await expect(page.getByText('Location:').first()).toBeVisible();
    await expect(page.getByText('Description:').first()).toBeVisible();
    await expect(page.getByText('Categories:').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).toBeVisible();
  });

  await test.step('Step 12: Click on the "Add to favorites!" button.', async () => {
    await page.getByRole('button', { name: 'Add to favorites!' }).click();

    await expect(page.getByText('This pet is one of your favorites! ♥').first()).toBeVisible();
    await expect(page.getByText('To remove, go to your Favorites page.')).toBeVisible();
  });

  await test.step('Step 13: Click on the "Adopt!" button.', async () => {
    await page.getByRole('button', { name: 'Adopt!' }).click();

    await expect(page.getByRole('heading', { name: 'Thank You for Adopting!' }).first()).toBeVisible();
    await expect(page.getByText('Owner\'s Name:').first()).toBeVisible();
    await expect(page.getByText('Owner\'s Phone Number:').first()).toBeVisible();
    await expect(page.locator("//div[contains(@class, 'adoption-dialog')]").first()).toBeVisible();
  });

  await test.step('Step 14: Close the window that popped up, then look at the "Edit Pet Details" form.', async () => {
    await page.getByRole('button', { name: 'Close' }).first().click();

    await expect(page.getByRole('heading', { name: 'Thank You for Adopting!' }).first()).not.toBeVisible();
    await expect(page.getByText('Owner\'s Name:').first()).not.toBeVisible();
    await expect(page.getByText('Owner\'s Phone Number:').first()).not.toBeVisible();
    await expect(page.locator("//div[contains(@class, 'adoption-dialog')]").first()).not.toBeVisible();

    await expect(page.locator('//label[contains(text(), "Name")]//input[contains(@class, "non-editable")]').first()).toBeVisible();
    await expect(page.getByText('Name cannot be modified.').first()).toBeVisible();
    await expect(page.getByLabel('Age:').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Age")]//input[contains(@class, "non-editable")]').first()).not.toBeVisible();
    await expect(page.locator('//label[contains(text(), "Species")]//input[contains(@class, "non-editable")]').first()).toBeVisible();
    await expect(page.getByText('Species cannot be modified.').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Breed")]//input[contains(@class, "non-editable")]').first()).toBeVisible();
    await expect(page.getByText('Breed cannot be modified.').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Gender")]//input[contains(@class, "non-editable")]').first()).toBeVisible();
    await expect(page.getByText('Gender cannot be modified.').first()).toBeVisible();
    await expect(page.getByLabel('Color:').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Color")]//input[contains(@class, "non-editable")]').first()).not.toBeVisible();
    await expect(page.getByLabel('Location:').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Location")]//input[contains(@class, "non-editable")]').first()).not.toBeVisible();
    await expect(page.getByLabel('Description:').first()).toBeVisible();
    await expect(page.locator('//label[contains(text(), "Desscription")]//input[contains(@class, "non-editable")]').first()).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Changes' }).first()).toBeVisible();
  });
});
