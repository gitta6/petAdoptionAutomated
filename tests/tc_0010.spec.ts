import { test, expect, Page } from '@playwright/test';
import testData from './tc_0010.json';
import randomstring from 'randomstring';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var testUserEmail = process.env.TEST_USER_EMAIL as string;
var testUserPassword = process.env.TEST_USER_PASSWORD as string;
var testUserName = process.env.TEST_USER_NAME as string;
var genderOptions: string[] = testData.genderOptions;
var genderSymbols: string[] = testData.genderSymbols;
var petName = randomstring.generate(8);
var petAge = Math.floor(Math.random() * 15);
var randomSpeciesIndex = Math.floor(Math.random() * 3);
var speciesOptions: string[] = testData.speciesOptions;
var petBreed = randomstring.generate(8);
var randomGenderIndex = Math.floor(Math.random() * 2);
var petColor = randomstring.generate(8);
var petDescription = randomstring.generate(30);
var petLocation = randomstring.generate(8);
var ownersName = randomstring.generate(15);
var ownersPhoneNumber = randomstring.generate({ length: 11, charset: 'numeric' });
var imageFormats: string[] = testData.imageFormats;
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

test('tc_0010', async ({ }, testInfo) => {
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

  await test.step('Step 4: Enter the correct passsword for the selected test account. Click on the "LOGIN" button.', async () => {
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

  await test.step('Step 7: Fill the "Breed", "Color", "Description", "Location", "Owner\'s name" \
    and "Owner\'s phone number" fields with dummy values, enter a positive number in the "Age" field, \
    and select any gender. For the "Name" field, enter a unique value and in the "Species" field, \
    enter "cat", "dog" or "rabbit". Click on the "Upload Pet" button.', async () => {
    await page.getByLabel('Name:', { exact: true }).click();
    await page.getByLabel('Name:', { exact: true }).pressSequentially(petName, { timeout: 500 });

    await page.getByLabel('Age:', { exact: true }).click();
    await page.getByLabel('Age:', { exact: true }).fill(petAge.toString());

    await page.getByLabel('Species:', { exact: true }).click();
    await page.getByLabel('Species:', { exact: true }).pressSequentially(speciesOptions[randomSpeciesIndex], { timeout: 500 });

    await page.getByLabel('Breed:', { exact: true }).click();
    await page.getByLabel('Breed:', { exact: true }).pressSequentially(petBreed, { timeout: 500 });

    await page.getByLabel('Gender:').selectOption(genderOptions[randomGenderIndex]);

    await page.getByLabel('Color:', { exact: true }).click();
    await page.getByLabel('Color:', { exact: true }).pressSequentially(petColor, { timeout: 500 });

    await page.getByLabel('Description:', { exact: true }).click();
    await page.getByLabel('Description:', { exact: true }).pressSequentially(petDescription, { timeout: 200 });

    await page.getByLabel('Location:', { exact: true }).click();
    await page.getByLabel('Location:', { exact: true }).pressSequentially(petLocation, { timeout: 500 });

    await page.getByLabel('Owner\'s name:', { exact: true }).click();
    await page.getByLabel('Owner\'s name:', { exact: true }).pressSequentially(ownersName, { timeout: 200 });

    await page.getByLabel('Owner\'s phone number:', { exact: true }).click();
    await page.getByLabel('Owner\'s phone number:', { exact: true }).pressSequentially(ownersPhoneNumber, { timeout: 200 });

    await page.getByRole('button', { name: 'Upload Pet' }).first().click();

    await expect(page.getByText('Failed to upload pet.').first()).toBeVisible();
    await expect(page.getByText('Please check your input and try again.').first()).toBeVisible();
  });

  await test.step('Step 8: For the "Image" field, select any image with either .jpg or .png, or .bmp format. \
  Click on "Upload Pet". ', async () => {
    var randomFormatIndex = Math.floor(Math.random() * 3);
    await page.getByLabel('Image:').setInputFiles('example.' + imageFormats[randomFormatIndex]);
    await delay(1000);
    await page.getByRole('button', { name: 'Upload Pet' }).first().click();

    await expect(page.getByText('Pet uploaded successfully!').first()).toBeVisible();
    await expect(page.getByText('Thank you').first()).toBeVisible();
  });

  await test.step('Step 9: Click on the newly uploaded pet.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByText(petName + ' is ' + petAge.toString() + ' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species: ' + speciesOptions[randomSpeciesIndex])).toBeVisible();
    await expect(page.getByText('Breed: ' + petBreed)).toBeVisible();
    await expect(page.getByText('Gender: ' + genderSymbols[randomGenderIndex])).toBeVisible();
    await expect(page.getByText('Color: ' + petColor)).toBeVisible();
    await expect(page.getByText('Location: ' + petLocation)).toBeVisible();
    await expect(page.getByText('Description: ' + petDescription)).toBeVisible();
    await expect(page.getByText('Categories:')).toBeVisible();
    await expect(page.getByRole('link', { name: speciesOptions[randomSpeciesIndex] })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).not.toBeVisible();
  });

  await test.step('Step 10: Click on the name of the logged in user at the top left corner.', async () => {
    await page.getByRole('link', { name: testUserName }).first().click();

    await expect(page.getByRole('link', { name: 'Upload a Pet' }).first()).toBeVisible();
    await expect(page.getByText('Sign Out').first()).toBeVisible();
  });

  await test.step('Step 11: Select "Sign Out".', async () => {
    await page.getByText('Sign Out').first().click();
    await delay(3000);

    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: testUserName }).first()).not.toBeVisible();
  });

  await test.step('Step 12: Click on "Login" on the top left. ', async () => {
    await page.getByRole('link', { name: 'Login' }).first().click();

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  await test.step('Step 13: Enter a valid email address of a test account that has admin rights. \
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

  await test.step('Step 14: Click on the newly uploaded pet.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByText(petName + ' is ' + petAge.toString() + ' year(s) old.')).toBeVisible();
    await expect(page.getByText('Species: ' + speciesOptions[randomSpeciesIndex])).toBeVisible();
    await expect(page.getByText('Breed: ' + petBreed)).toBeVisible();
    await expect(page.getByText('Gender: ' + genderSymbols[randomGenderIndex])).toBeVisible();
    await expect(page.getByText('Color: ' + petColor)).toBeVisible();
    await expect(page.getByText('Location: ' + petLocation)).toBeVisible();
    await expect(page.getByText('Description: ' + petDescription)).toBeVisible();
    await expect(page.getByText('Categories:')).toBeVisible();
    await expect(page.getByRole('link', { name: speciesOptions[randomSpeciesIndex] })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to favorites!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit Pet Details' })).toBeVisible();
  });

  await test.step('Step 15: Click on "Delete".', async () => {
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.accept().catch(() => { });
    });
    await page.getByRole('button', { name: 'Delete' }).click();

    await delay(3000);
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible();
    await expect(page.getByRole('link', { name: petName }).first()).not.toBeVisible();
  });

  await test.step('Step 16: Click on the search bar and enter the name of the previously deleted pet. Click on the search icon.', async () => {
    await page.getByPlaceholder('Search for pets...').click();
    await page.getByPlaceholder('Search for pets...').fill('');
    await page.getByPlaceholder('Search for pets...').pressSequentially(petName, { timeout: 500 });
    await page.getByPlaceholder('searchButton').first().click();

    await expect(page.getByRole('link', { name: petName }).first()).not.toBeVisible();
    await expect(page.getByText('No results! Go to Homepage!').first()).toBeVisible();
  });
  /* */
});