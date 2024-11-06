import { test, expect, Page } from '@playwright/test';
import testData from './tc_0009.json';
import randomstring from 'randomstring';
import sharedData from './sharedData.json';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let context;
let page: Page;

var petName = testData.petName;
var testAdminUserEmail = process.env.TEST_ADMIN_USER_EMAIL as string;
var testAdminUserPassword = process.env.TEST_ADMIN_USER_PASSWORD as string;
var testAdminUserName = process.env.TEST_ADMIN_USER_NAME as string;
var petId = testData.petId;
var randomDescription = randomstring.generate(30);
var randomColor = randomstring.generate(10);
var randomLocation = randomstring.generate(10);
var randomAge = Math.floor(Math.random() * 15);
var originalDescription = testData.originalDescription;
var originalColor = testData.originalColor;
var originalLocation = testData.originalLocation;
var originalAge = testData.originalAge;
var pageUrl = sharedData.pageUrl;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('tc_0009', async ({ }, testInfo) => {
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

  await test.step('Step 3: Enter a valid email address of a test account that has admin rights. \
    Then, enter the correct password for the selected test account and click on the "LOGIN" button.', async () => {
    await page.locator('form div').filter({ hasText: 'Email' }).locator('div').first().click();
    await page.getByPlaceholder('Email').pressSequentially(testAdminUserEmail, { timeout: 500 });
    await page.locator('form div').filter({ hasText: 'Password' }).locator('div').first().click();
    await page.getByPlaceholder('Password').pressSequentially(testAdminUserPassword, { timeout: 500 });
    await delay(2000);
    await page.getByRole('button', { name: 'LOGIN' }).click({ force: true });

    await expect(page.getByText('Login Successful.').first()).toBeVisible();
    await expect(page.getByText('Welcome to PetAdoption, ' + testAdminUserName + '!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
  });

  await test.step('Step 4: Click on any of the pets listed.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByText(petName + ' is ')).toBeVisible();
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

  await test.step('Step 5: Look at the "Edit Pet Details" form.', async () => {
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

  await test.step('Step 6: Modify the "Age" field to a negative number, then click on "Save Changes".', async () => {
    var randomNegativeAge = Math.floor(Math.random() * -15);
    await page.getByLabel('Age:', { exact: true }).click();
    await page.getByLabel('Age:', { exact: true }).fill(randomNegativeAge.toString());
    await delay(500);
    await page.getByRole('button', { name: 'Save Changes' }).first().click();

    await expect(page.getByText('Validation Error', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Age must be a positive number!', { exact: true }).first()).toBeVisible();
  });

  await test.step('Step 7: Modify the "Description", "Color" and the "Location" to dummy values, \
    and also change the "Age" field to a new value (positive number). Click on "Save Changes".', async () => {
    await page.getByLabel('Description:', { exact: true }).click();
    await page.getByLabel('Description:', { exact: true }).fill('');
    await page.getByLabel('Description:', { exact: true }).pressSequentially(randomDescription, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Color:', { exact: true }).click();
    await page.getByLabel('Color:', { exact: true }).fill('');
    await page.getByLabel('Color:', { exact: true }).pressSequentially(randomColor, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Location:', { exact: true }).click();
    await page.getByLabel('Location:', { exact: true }).fill('');
    await page.getByLabel('Location:', { exact: true }).pressSequentially(randomLocation, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Age:', { exact: true }).click();
    await page.getByLabel('Age:', { exact: true }).fill(randomAge.toString());
    await delay(500);
    await page.getByRole('button', { name: 'Save Changes' }).first().click();

    await expect(page.getByText('Pet updated successfully', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(petName + ' is ' + randomAge + ' year(s) old.')).toBeVisible();
    await expect(page.getByText('Color: ' + randomColor).first()).toBeVisible();
    await expect(page.getByText('Location: ' + randomLocation).first()).toBeVisible();
    await expect(page.getByText('Description: ' + randomDescription).first()).toBeVisible();
  });

  await test.step('Step 8: Navigate to the home page by clicking on the "PetAdoption" label on the top right.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
    await expect(page.locator("//a[contains(@ng-reflect-router-link, '/pet/" + petId + "')]//\
      div[contains(@class, 'locations')][contains(text(), '" + randomLocation + "')] ").first()).toBeVisible();
    await expect(page.locator("//a[contains(@ng-reflect-router-link, '/pet/" + petId + "')]//\
      div[contains(@class, 'ages')][contains(text(), '" + randomAge + "')] ").first()).toBeVisible();
  });

  await test.step('Step 9: Open the same pet that was previously modified.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByText(petName + ' is ' + randomAge + ' year(s) old.')).toBeVisible();
    await expect(page.getByText('Color: ' + randomColor).first()).toBeVisible();
    await expect(page.getByText('Location: ' + randomLocation).first()).toBeVisible();
    await expect(page.getByText('Description: ' + randomDescription).first()).toBeVisible();
  });

  await test.step('Step 10: In the "Edit Pet Details" form, change the "Description", "Color", "Age" \
    and "Location" fields back to their original values. Click on "Save Changes".', async () => {
    await page.getByLabel('Description:', { exact: true }).click();
    await page.getByLabel('Description:', { exact: true }).fill('');
    await page.getByLabel('Description:', { exact: true }).pressSequentially(originalDescription, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Color:', { exact: true }).click();
    await page.getByLabel('Color:', { exact: true }).fill('');
    await page.getByLabel('Color:', { exact: true }).pressSequentially(originalColor, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Location:', { exact: true }).click();
    await page.getByLabel('Location:', { exact: true }).fill('');
    await page.getByLabel('Location:', { exact: true }).pressSequentially(originalLocation, { timeout: 200 });
    await delay(500);
    await page.getByLabel('Age:', { exact: true }).click();
    await page.getByLabel('Age:', { exact: true }).fill(originalAge.toString());
    await delay(500);
    await page.getByRole('button', { name: 'Save Changes' }).first().click();

    await expect(page.getByText('Pet updated successfully', { exact: true }).first()).toBeVisible();
    await expect(page.getByText(petName + ' is ' + originalAge + ' year(s) old.')).toBeVisible();
    await expect(page.getByText('Color: ' + originalColor).first()).toBeVisible();
    await expect(page.getByText('Location: ' + originalLocation).first()).toBeVisible();
    await expect(page.getByText('Description: ' + originalDescription).first()).toBeVisible();
  });

  await test.step('Step 11: Navigate to the home page by clicking on the "PetAdoption" label on the top right.', async () => {
    await page.getByRole('link', { name: 'Pet Adoption' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
    await expect(page.locator("//a[contains(@ng-reflect-router-link, '/pet/" + petId + "')]//\
      div[contains(@class, 'locations')][contains(text(), '" + originalLocation + "')] ").first()).toBeVisible();
    await expect(page.locator("//a[contains(@ng-reflect-router-link, '/pet/" + petId + "')]//\
      div[contains(@class, 'ages')][contains(text(), '" + originalAge + "')] ").first()).toBeVisible();
  });
  /* */
});
