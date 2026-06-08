import { Locator, Page } from "playwright";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage{
    private paymentProvider: Locator
    private submitBtn: Locator

    constructor(page:Page){
        super(page)
        this.paymentProvider = page.locator(".bodyView")
        this.submitBtn = page.locator("//button[@type='submit']")
    }
    
    async getContentOfTable(productName: string){
       return await this.page.locator(`//td[contains(text(), '${productName}')]`)
    }

    async buyViaCreditCard(){
        await this.submitBtn.waitFor({state:'visible'})
        await this.submitBtn.click()
        //await this.paymentProvider.waitFor({'state':'visible'})
    }
}