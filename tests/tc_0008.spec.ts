import { test, expect, Page } from '@playwright/test';
import testData from './tc_0008.json';
import randomstring from 'randomstring';
import sharedData from './sharedData.json';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var testUserEmail = process.env.TEST_USER_EMAIL as string;
var testUserPassword = process.env.TEST_USER_PASSWORD as string;
var testUserName = process.env.TEST_USER_NAME as string;
var optionName = testData.optionName;
var formatOptions: string[] = testData.formatOptions;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0008', async ({ }, testInfo) => {
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
    await page.getByPlaceholder('Email').pressSequentially(testUserEmail, { timeout: 500 });

    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input-validation').filter({ hasText: 'Email is invalid!' })).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-valid")]')).toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Email")]//input[contains(@class, "ng-invalid")]')).not.toBeVisible();
    await expect(page.locator('//text-input[contains(@label, "Password")]//input-validation').filter({ hasText: 'Enter a value!' })).not.toBeVisible();
  });

  await test.step('Step 4: Enter the correct password for the selected test account. Click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByPlaceholder('Password').pressSequentially(testUserPassword, { timeout: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click();

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.locator('//ul[contains(@placeholder, "results")]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
  });

  await test.step('Step 5: Click on the name of the logged in user at the top left corner.', async () => {
    await page.getByRole('link', { name: testUserName }).first().click();

    await expect(page.getByRole('link', { name: 'Upload a Pet' }).first()).toBeVisible();
    await expect(page.getByText('Sign Out').first()).toBeVisible();
  });

  await test.step('Step 6: Select "Upload a Pet".', async () => {
    await page.getByRole('link', { name: 'Upload a Pet' }).first().click();

    await expect(page.getByLabel('Name:', { exact: true }).first()).toBeVisible();
    await expect(page.getByLabel('Age:', { exact: true }).first()).toBeVisible();
    await expect(page.getByLabel('Species:').first()).toBeVisible();
    await expect(page.getByLabel('Breed:').first()).toBeVisible();
    await expect(page.getByText('Gender:').first()).toBeVisible();
    await expect(page.getByLabel('Color:').first()).toBeVisible();
    await expect(page.getByLabel('Description:').first()).toBeVisible();
    await expect(page.getByLabel('Location:').first()).toBeVisible();
    await expect(page.getByLabel('Owner\'s name:').first()).toBeVisible();
    await expect(page.getByLabel('Owner\'s phone number:').first()).toBeVisible();
    await expect(page.getByLabel('Image:').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload Pet' }).first()).toBeVisible();
    await expect(page.getByText('Category tags are automatically filtered from the entered values.').first()).toBeVisible();
  });

  await test.step('Step 7: Click on the "Upload Pet" button.', async () => {
    await page.getByRole('button', { name: 'Upload Pet' }).first().click();

    await expect(page.getByText('Error').first()).toBeVisible();
    await expect(page.getByText('Please fill all of the fields with a valid value!')).toBeVisible();
  });

  await test.step('Step 8: Fill the "Name" field with a dummy value, then clear it. ', async () => {
    await page.getByLabel('Name:', { exact: true }).click();
    await page.getByLabel('Name:', { exact: true }).pressSequentially(randomstring.generate(8), { timeout: 500 });
    await page.getByLabel('Name:', { exact: true }).fill('');

    await expect(page.getByText('Name is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 9: Fill the "Age" field with any number, then clear it.', async () => {
    await page.getByLabel('Age:', { exact: true }).click();
    var randomNumber = Math.floor(Math.random() * 15);
    await page.getByLabel('Age:', { exact: true }).fill(randomNumber.toString());
    await page.getByLabel('Age:', { exact: true }).fill('');

    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 10: Fill the "Age" field with a negative number.', async () => {
    await page.getByLabel('Age:', { exact: true }).click();
    var randomNegativeNumber = Math.floor(Math.random() * -15);
    await page.getByLabel('Age:', { exact: true }).fill(randomNegativeNumber.toString());

    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 11: Fill the "Age" field with a positive decimal number, which should include a comma (e.g. 2,5). ', async () => {
    await page.getByLabel('Age:', { exact: true }).click();
    await page.getByLabel('Age:', { exact: true }).fill('');
    var randomDecimal = Math.floor(Math.random() * 15) + ',' + Math.floor(Math.random() * 10)
    await page.getByLabel('Age:', { exact: true }).pressSequentially(randomDecimal, {timeout: 500});

    await expect(page.locator("//small[contains(text(), 'Age')]").first()).not.toBeVisible();
    await expect(page.getByText('Age is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 12: Fill the "Age" field with a positive decimal number, which should include a decimal point (e.g. 2.5).', async () => {
    await page.getByLabel('Age:', { exact: true }).click();
    var randomDecimal = Math.floor(Math.random() * 15) + '.' + Math.floor(Math.random() * 10);
    await page.getByLabel('Age:', { exact: true }).fill('');
    await page.getByLabel('Age:', { exact: true }).pressSequentially(randomDecimal.toString(), {timeout: 500});

    await expect(page.locator("//small[contains(text(), 'Age')]").first()).not.toBeVisible();
    await expect(page.getByText('Age is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 13: Fill the "Species" field with a dummy value, then clear it. ', async () => {
    await page.getByLabel('Species:', { exact: true }).click();
    await page.getByLabel('Species:', { exact: true }).pressSequentially(randomstring.generate(8), { timeout: 500 });
    await page.getByLabel('Species:', { exact: true }).fill('');

    await expect(page.getByText('Species is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 14: Fill the "Breed" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Breed:', { exact: true }).click();
    await page.getByLabel('Breed:', { exact: true }).pressSequentially(randomstring.generate(8), { timeout: 500 });
    await page.getByLabel('Breed:', { exact: true }).fill('');

    await expect(page.getByText('Breed is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 15: Click on the "Gender" field, do not select any option, then close the dropdown menu.', async () => {
    await page.getByLabel('Gender:', { exact: true }).click();
    await delay(1000);
    await page.getByLabel('Breed:', { exact: true }).click();

   await expect(page.getByText('Gender is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 16: Click on the "Gender" field again, and select any option.', async () => {
    await page.getByLabel('Gender:').selectOption(optionName);

    await expect(page.getByText('Gender is required!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 17: Fill the "Color" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Color:', { exact: true }).click();
    await page.getByLabel('Color:', { exact: true }).pressSequentially(randomstring.generate(8), { timeout: 500 });
    await page.getByLabel('Color:', { exact: true }).fill('');

    await expect(page.getByText('Color is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 18: Fill the "Description" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Description:', { exact: true }).click();
    await page.getByLabel('Description:', { exact: true }).pressSequentially(randomstring.generate(30), { timeout: 200 });
    await page.getByLabel('Description:', { exact: true }).fill('');

    await expect(page.getByText('Description is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 19: Fill the "Location" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Location:', { exact: true }).click();
    await page.getByLabel('Location:', { exact: true }).pressSequentially(randomstring.generate(8), { timeout: 500 });
    await page.getByLabel('Location:', { exact: true }).fill('');

    await expect(page.getByText('Location is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 20: Fill the "Owner\'s name" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Owner\'s name:', { exact: true }).click();
    await page.getByLabel('Owner\'s name:', { exact: true }).pressSequentially(randomstring.generate(15), { timeout: 200 });
    await page.getByLabel('Owner\'s name:', { exact: true }).fill('');

    await expect(page.getByText('The owner\'s name is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 21: Fill the "Owner\'s phone number" field with a dummy value, then clear it.', async () => {
    await page.getByLabel('Owner\'s phone number:', { exact: true }).click();
    await page.getByLabel('Owner\'s phone number:', { exact: true }).pressSequentially(randomstring.generate({ length: 11, charset: 'numeric'}), { timeout: 200 });
    await page.getByLabel('Owner\'s phone number:', { exact: true }).fill('');

    await expect(page.getByText('The owner\'s phone number is required!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 22: For the "Image" field, select a file that is not an image (e.g. .json, .txt).', async () => {
    var randomFormatIndex = Math.floor(Math.random() * 2);
    await page.getByLabel('Image:').setInputFiles('example.' + formatOptions[randomFormatIndex]);

    await delay(1000);
    await expect(page.getByText('Wrong format! Please upload a .jpg, .png or .bmp file!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 23: Now, select a .jpg file for the "Image" field.', async () => {
    await page.getByLabel('Image:').setInputFiles('example.jpg');
    
    await delay(1000);
    await expect(page.getByText('Wrong format! Please upload a .jpg, .png or .bmp file!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 24: Now, select a .png file for the "Image" field.', async () => {
    await page.getByLabel('Image:').setInputFiles('example.png');

    await delay(1000);
    await expect(page.getByText('Wrong format! Please upload a .jpg, .png or .bmp file!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 25: Now, select a .bmp file for the "Image" field.', async () => {
    await page.getByLabel('Image:').setInputFiles('example.bmp');

    await delay(1000);
    await expect(page.getByText('Wrong format! Please upload a .jpg, .png or .bmp file!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 26: Click on the name of the logged in user at the top left corner.', async () => {
    await page.getByRole('link', { name: testUserName }).first().click();

    await expect(page.getByRole('link', { name: 'Upload a Pet' }).first()).toBeVisible();
    await expect(page.getByText('Sign Out').first()).toBeVisible();
  });

  await test.step('Step 27: Select "Sign Out".', async () => {
    await page.getByText('Sign Out').first().click();
    await delay(3000);

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: testUserName }).first()).not.toBeVisible();

    await expect(page.getByText('Name is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.locator("//small[contains(text(), 'Age')]").first()).not.toBeVisible();
    await expect(page.getByText('Age is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Species is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Breed is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Gender is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Color is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Description is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('Location is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('The owner\'s name is required!', { exact: true }).first()).not.toBeVisible();
    await expect(page.getByText('The owner\'s phone number is required!', { exact: true }).first()).not.toBeVisible();
  });

  await test.step('Step 28: Click on the "Upload Pet" button.', async () => {
    await page.getByRole('button', { name: 'Upload Pet' }).first().click();

    await expect(page.getByText('Login Required').first()).toBeVisible();
    await expect(page.getByText('Uploading pets is only available to logged in users!')).toBeVisible();
  });

  /* */
});
