import { Page, Locator, expect } from "@playwright/test";

export class GooglePage {
  readonly page: Page;
  readonly toolsButton: Locator;
  readonly declineCookiesButton:Locator
  readonly googleSearchInput: Locator;
  readonly timePicker: Locator;
  readonly pastMonthFilter: Locator;
  readonly past24HourFilter: Locator;
  readonly pastWeekFilter: Locator;
  readonly pastMonthAnchor: Locator;
  readonly pastWeekAnchor: Locator;
  readonly past24HourAnchor: Locator;

  constructor(page: Page) {
    this.page = page;

    this.declineCookiesButton = page.locator('#W0wltc');
    this.toolsButton = page.locator('#hdtb-tls');
    this.googleSearchInput = page.locator('[name="q"]');   
    this.timePicker = page.locator('g-popup').getByText('Any time').first();
    this.pastMonthFilter = page.locator('[role="menuitemradio"]').getByText('Past hour');
    this.past24HourFilter = page.getByRole("menuitemradio").getByText('Past 24 hours')
    this.pastWeekFilter = page.getByRole('menuitemradio').getByText('Past week');
    this.pastMonthAnchor = page.locator('span').getByText(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}, \d{4}\b/);
    this.pastWeekAnchor = page.locator('span').getByText(/days ago/);
    this.past24HourAnchor = page.locator('span').getByText(/hours ago/);
  }

  async goto() {
    await this.page.goto("https://www.google.com/ncr?hl=en");
    await this.declineCookiesButton.click();
    expect(this.page.url()).toContain('google.com');
  }

  async doGoogleSearch(keyword: string) {
    await this.googleSearchInput.fill(keyword);
    await this.googleSearchInput.press('Enter');
    expect(this.page.url()).toContain('/search');
  }

  async filterGoogleSearch(filter: string) {
    const requestPromise = this.page.waitForRequest(/^https:\/\/www\.google\.com\/async\/bgasy\?(.*)$/);
    
    const filterLocators: Record<string, Locator> = {
      Past_24_hours: this.past24HourFilter,
      Past_week    : this.pastWeekFilter,
      Past_month    : this.pastMonthFilter,
    };
  
    const filterLocator = filterLocators[filter];
  
    await this.toolsButton.click();
    await this.timePicker.click();
    await filterLocator.click();

    const response = await requestPromise; 
  }

  async verifyGoogleSearchResult(result: string) {
    const resultDetails: Record<string, { resLocator: Locator }> = {
      Past_24_hours: {resLocator: this.past24HourAnchor },
      Past_week: { resLocator: this.pastWeekAnchor },
      Past_month: { resLocator: this.pastMonthAnchor },
    };
  
    const details = resultDetails[result];
     
    await expect(await details.resLocator.count()).toBeGreaterThan(0);
  }
}

export default GooglePage;