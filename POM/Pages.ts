import { Page } from "@playwright/test";
import { MainPage } from "@POM/MainPage";
import { ProductsListing } from "@POM/ProductListting";
import { CheckoutPage } from "@POM/CheckoutPage";
import { Payments } from "@helpers/Payments";
import { ThankYouPage } from "@POM/ThankYouPage";
import { BasePage } from "@POM/BasePage";


export class Pages extends BasePage{
    mainPage: MainPage
    productListing: ProductsListing
    checkoutPage: CheckoutPage
    payments: Payments
    thankYouPage: ThankYouPage
    
    constructor(page: Page){
        super(page)
        this.mainPage = new MainPage(page)
        this.productListing = new ProductsListing(page)
        this.checkoutPage = new CheckoutPage(page)
        this.payments = new Payments(page)
        this.thankYouPage = new ThankYouPage(page)
    }
}