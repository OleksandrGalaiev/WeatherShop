import { Locator, Page } from "playwright";
import { BasePage } from "./BasePage";

export class ThankYouPage extends BasePage{
    private headerTitle: Locator
    private copyright: Locator

    constructor(page: Page){
        super(page)
        this.headerTitle=page.locator('//h2')
        this.copyright = page.locator('.ws_copyright')
    }
    async getTitleText(){
        await this.copyright.waitFor({state:'visible'})
        return await this.headerTitle.textContent()
    }
}