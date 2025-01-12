import { expect, Page, Locator } from "@playwright/test";

export class BingPage {
  readonly page: Page;
  readonly bingSearchInput: Locator;
  readonly newsFilter: Locator;
  readonly imagesFilter: Locator;
  readonly videosFilter: Locator;
  readonly imageCardCSS: string;
  readonly videoCardCSS: string;
  readonly newsCardCSS: string;

  constructor(page: Page) {
    this.page = page;

    this.bingSearchInput = page.locator('[type="search"]').first();
    this.newsFilter = page.locator('a').getByText('News');
    this.imagesFilter = page.locator('a').getByText('Images')
    this.videosFilter = page.locator('a').getByText('Videos');
    this.imageCardCSS ='.mimg';
    this.videoCardCSS = '.mc_fgvc_u';
    this.newsCardCSS = '.news-card';
  }
 
  async goto() {
    await this.page.goto("https://bing.com");
    expect(this.page.url()).toContain('bing.com');
  }

  async doBingSearch(keyword: string) {
    await this.page.locator('#bnp_btn_reject').click();
    await this.bingSearchInput.fill(keyword);
    await this.bingSearchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
    expect(this.page.url()).toContain('/search');
  }

  async filterBingSearch(filter: string) {
    const filterLocators: Record<string, Locator> = {
      News: this.newsFilter,
      Images: this.imagesFilter,
      Videos: this.videosFilter,
    };
  
    const filterLocator = filterLocators[filter];

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'), 
      filterLocator.click(), 
    ]);
  
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  async verifyBingSearchResult(newPage: Page,result: string) {
    const resultDetails: Record<string, { urlPart: string; cardLocator: string }> = {
      News: { urlPart: '/news/search', cardLocator: this.newsCardCSS },
      Images: { urlPart: '/images/search', cardLocator: this.imageCardCSS },
      Videos: { urlPart: 'videos/search', cardLocator: this.videoCardCSS },
    };
  
    const details = resultDetails[result];
    expect(newPage.url()).toContain(details.urlPart);
    expect(await newPage.locator(details.cardLocator).count()).toBeGreaterThan(0);
  }
}

export default BingPage;