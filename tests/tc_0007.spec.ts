import { test, expect, Page } from '@playwright/test';
import testData from './tc_0007.json';

let context;
let page: Page;

var catsArray: string[] = testData.catsArray;
var dogsArray: string[] = testData.dogsArray;
var rabbitsArray: string[] = testData.rabbitsArray;
var femalePetsArray: string[] = testData.femalePetsArray;
var malePetsArray: string[] = testData.malePetsArray;
var petName = testData.petName;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});2

test.afterAll(async () => {
  await page.close();
});

test('tc_0007', async ({ }, testInfo) => {
  await test.step('Step 1: Open PetAdoption.', async () => {
    await page.goto('http://localhost:4200/');

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
  });

  await test.step('Step 2: Look at the categories.', async () => {
    await expect(page.getByRole('link', { name: 'All (' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Male (' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Female (' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dog (' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cat (' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Rabbit (' }).first()).toBeVisible();
  });

  await test.step('Step 3: Select "Cat" from the categories.', async () => {
    await page.getByRole('link', { name: 'Cat (' }).first().click();

    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 4: Click on the "Cat" category again.', async () => {
    await page.getByRole('link', { name: 'Cat (' }).first().click();

    await expect(page.getByRole('heading', { name: 'Please wait...' }).first()).not.toBeVisible();
    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 5: Click on any of the cats listed.', async () => {
    var randomIndex = Math.floor(Math.random() * catsArray.length);
    await page.getByRole('link', { name: catsArray[randomIndex] }).first().click();

    await expect(page.getByText(catsArray[randomIndex] + ' is ')).toBeVisible();
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

  await test.step('Step 6: Go back to the previous page.', async () => {
    await page.goBack();

    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 7: Select "Dog" from the categories.', async () => {
    await page.getByRole('link', { name: 'Dog (' }).first().click();

    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 8: Select "Rabbit" from the categories. ', async () => {
    await page.getByRole('link', { name: 'Rabbit (' }).first().click();

    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 9: Select "Male" from the categories.', async () => {
    await page.getByRole('link', { name: 'Male (' }).first().click();

    for (let i = 0; i < malePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: malePetsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < femalePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: femalePetsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 10: Select "Female" from the categories.', async () => {
    await page.getByRole('link', { name: 'Female (' }).first().click();

    for (let i = 0; i < femalePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: femalePetsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < malePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: malePetsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 11: Reload the page.', async () => {
    await page.reload();

    for (let i = 0; i < femalePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: femalePetsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < malePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: malePetsArray[i] }).first()).not.toBeVisible();
    };
  });

  await test.step('Step 14: Select "All" from the categories.', async () => {
    await page.getByRole('link', { name: 'All (' }).first().click();

    for (let i = 0; i < malePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: malePetsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < femalePetsArray.length; i++) {
      await expect(page.getByRole('link', { name: femalePetsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).toBeVisible();
    };
  });

  await test.step('Step 13: Click on a pet that is a male cat.', async () => {
    await page.getByRole('link', { name: petName }).first().click();

    await expect(page.getByRole('link', { name: 'Male' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cat' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Female' }).first()).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Dog' }).first()).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Rabbit' }).first()).not.toBeVisible();
  });

  await test.step('Step 14: Click on the "Cat" category.', async () => {
    await page.getByRole('link', { name: 'Cat' }).first().click();

    await expect(page.getByRole('link', { name: 'Pet Adoption' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories:' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adopt!' }).first()).not.toBeVisible(); 
    for (let i = 0; i < catsArray.length; i++) {
      await expect(page.getByRole('link', { name: catsArray[i] }).first()).toBeVisible();
    };
    for (let i = 0; i < dogsArray.length; i++) {
      await expect(page.getByRole('link', { name: dogsArray[i] }).first()).not.toBeVisible();
    };
    for (let i = 0; i < rabbitsArray.length; i++) {
      await expect(page.getByRole('link', { name: rabbitsArray[i] }).first()).not.toBeVisible();
    };
  });
});
