import { Locator, Page } from "@playwright/test";
import { BasePage } from "@POM/BasePage";

export class ThankYouPage extends BasePage{
    private headerTitle: Locator
    private copyright: Locator

    constructor(page: Page){
        super(page)
        this.headerTitle=page.getByRole('heading')
        this.copyright = page.locator('.ws_copyright')
    }
    async getTitleText(){
        await this.copyright.waitFor({state:'visible'})
        return this.headerTitle
    }
}