import { expect, Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { BingPage } from '../../pages/search.bing.page.ts';
import { GooglePage } from '../../pages/search.google.page.ts';

const { Given, When, Then } = createBdd();


Given('User navigates to the {string} search', async ({ page }, engine: string) => {
    const bingoPage = new BingPage(page);
    const googlePage = new GooglePage(page);

    engine === 'bingo' ? await bingoPage.goto() : await googlePage.goto();
});

When('User inputs {string} in the search input using {string}', async ({ page }, keyword: string, engine: string) => {
    const bingoPage = new BingPage(page);
    const googlePage = new GooglePage(page);

    engine === 'bingo' ? await bingoPage.doBingSearch(keyword) : await googlePage.doGoogleSearch(keyword);

});

When('User filters search result with {string} in the {string}', async ({ page }, filter: string, engine: string) => {
    const bingoPage = new BingPage(page);
    const googlePage = new GooglePage(page);

    engine === 'bingo' ? await bingoPage.filterBingSearch(filter) : await googlePage.filterGoogleSearch(filter);
});

Then('User sees search results filtered as {string} in the {string}', async ({ page }, result: string, engine: string) => {
    const bingoPage = new BingPage(page);
    const googlePage = new GooglePage(page);

    engine === 'bingo' ? await bingoPage.verifyBingSearchResult(result) : await googlePage.verifyGoogleSearchResult(result);
});