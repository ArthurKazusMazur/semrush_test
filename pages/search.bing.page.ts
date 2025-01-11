import { expect, Page, Locator } from "@playwright/test";

export class BingPage {
  readonly page: Page;
  readonly bingSearchInput: Locator;
  readonly newsFilter: Locator;
  readonly imagesFilter: Locator;
  readonly videosFilter: Locator;
  readonly imageCardCSS: Locator;
  readonly videoCardCSS: Locator;
  readonly newsCardCSS: Locator;

  constructor(page: Page) {
    this.page = page;

    this.bingSearchInput = page.locator('[type="search"]').first();
    this.newsFilter = page.locator('a').getByText('News');
    this.imagesFilter = page.locator('a').getByText('Images')
    this.videosFilter = page.locator('a').getByText('Videos');
    this.imageCardCSS = page.locator('.mimg');
    this.videoCardCSS = page.locator('.mc_fgvc_u');
    this.newsCardCSS = page.locator('.news-card');
  }
 
  async goto() {
    await this.page.goto("https://bing.com");
    expect(this.page.url()).toContain('bing.com');
  }

  async doBingSearch(keyword: string) {
    await this.bingSearchInput.fill(keyword);
    await this.bingSearchInput.press('Enter');
    expect(this.page.url()).toContain('/search');
  }

  async filterBingSearch(filter: string) {
    const filterLocators: Record<string, Locator> = {
      News: this.newsFilter,
      Images: this.imagesFilter,
      Videos: this.videosFilter,
    };
  
    const filterLocator = filterLocators[filter];
  
    await filterLocator.click();
  }

  async verifyBingSearchResult(result: string) {
    const resultDetails: Record<string, { urlPart: string; cardLocator: Locator }> = {
      News: { urlPart: '/news/search', cardLocator: this.newsCardCSS },
      Images: { urlPart: '/images/search', cardLocator: this.imageCardCSS },
      Videos: { urlPart: 'videos/search', cardLocator: this.videoCardCSS },
    };
  
    const details = resultDetails[result];
     
    expect(this.page.url()).toContain(details.urlPart);
    expect(await details.cardLocator.count()).toBeGreaterThan(0);
  }
}

export default BingPage;