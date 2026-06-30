import { Locator, Page } from "@playwright/test";
import { BasePage } from "@POM/BasePage";

export class CheckoutPage extends BasePage{
    private submitBtn: Locator

    constructor(page:Page){
        super(page)
        this.paymentProvider = page.locator(".bodyView")
        this.submitBtn = page.getByRole('button',{name:'Pay with Card'})
    }
    
    getContentOfTable(productName: string){
       return this.page.locator('//td').filter({hasText: productName})
    }

    async buyViaCreditCard(){
        await this.submitBtn.click()
    }
}