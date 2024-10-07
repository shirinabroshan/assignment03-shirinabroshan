import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";
import dotenv from 'dotenv';
import { FakerPage } from './pages/faker-page.ts';




test.describe('Frontend testsuite', () => {
  test('create client', async ({ page }) => {
    //inlogning
    await page.goto(`http://localhost:3000`);
    await page.locator('#app > div > form > div:nth-child(1) > input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('#app > div > form > div:nth-child(2) > input[type=password]').fill(`${process.env.TEST_PASSWORD}`);
    await page.locator('#app > div > form > div.field.action > button').click();

    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible()
    await page.getByRole('heading', { name: 'Tester Hotel Overview' }).click();
    //view client
    await page.locator('#app > div > div > div:nth-child(2) > a').click();
    //använt pages och fakerdata för att skapa client
    const newclient = new FakerPage(page);
    await newclient.newclientwithfaker();
  });

  test('Edit client01', async ({ page }) => {
    //inlogning
    await page.goto(`http://localhost:3000`);
    await page.locator('#app > div > form > div:nth-child(1) > input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('#app > div > form > div:nth-child(2) > input[type=password]').fill(`${process.env.TEST_PASSWORD}`);
    await page.locator('#app > div > form > div.field.action > button').click();

    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible()
    await page.getByRole('heading', { name: 'Tester Hotel Overview' }).click();

    //view client
    await page.locator('#app > div > div > div:nth-child(2) > a').click();
    await page.getByText('Clients').click();

    //Edit client01
    await page.locator('#app > div > div.clients > div:nth-child(1) > div.action > img').click();
    await page.locator('#app > div > div.clients > div:nth-child(1) > div.menu > a:nth-child(1)').click();
    await page.locator('#app > div > h2 > div').click();
    await page.locator('#app > div > div:nth-child(2) > div:nth-child(3) > input[type=text]').fill('shirinabroshan');
    await page.locator('#app > div > div.actions > a.btn.blue').click();
    await expect(page.getByRole('heading', { name: 'shirinabroshan (#1)' })).toHaveText('shirinabroshan (#1)');
  });
});

test.describe('Backend testsuite', () => {
  test('get all rooms', async ({ request }) => {
    // Gör login-förfrågan och få token
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD
      }
    });
    expect(loginResponse.ok()).toBeTruthy();
    // Extrahera token från login-svaret
    //console.log (loginResponse)
    const loginData = await loginResponse.json();
    const token = loginData.token;

    // Gör GET-förfrågan till /rooms med token i headers
    const getAllRoomsResponse = await request.get('http://localhost:3000/api/rooms', {
      headers: {
        'Content-Type': 'application/json',
        'x-user-auth': JSON.stringify({
          username: process.env.TEST_USERNAME,
          token: token
        })
      }
    });
    expect(getAllRoomsResponse.ok()).toBeTruthy();
  });


  test('delete room 02', async ({ request }) => {
    // Gör login-förfrågan och få token
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD
      }
    });
    expect(loginResponse.ok()).toBeTruthy();

    // Extrahera token från login-svaret
    const loginData = await loginResponse.json();
    const token = loginData.token;

    const deleteResponse = await request.delete('http://localhost:3000/api/room/2', {
      headers: {
        'Content-Type': 'application/json',
        'x-user-auth': JSON.stringify({
          username: process.env.TEST_USERNAME,
          token: token
        })
      }
    });
    expect(deleteResponse.status()).toBe(200);

    // Kontrollera att rummet faktiskt har tagits bort genom att göra en GET-förfrågan
    const addRoomResponse = await request.post('http://localhost:3000/api/room/new', {
      headers: {
        'Content-Type': 'application/json',
        'x-user-auth': JSON.stringify({
          username: process.env.TEST_USERNAME,
          token: token
        })
      },
      data: {
        category: "double",
        floor: 2,
        number: 131,
        available: true,
        price: 150,
        features: [
          "balcony",
          "ensuite"
        ]
      }
    });

  });
});



