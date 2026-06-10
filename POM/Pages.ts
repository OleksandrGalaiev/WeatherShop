import { Page } from "playwright";
import { MainPage } from "./MainPage";
import { ProductsListing } from "./ProductListting";
import { CheckoutPage } from "./CheckoutPage";
import { Payments } from "../helpers/Payments";
import { ThankYouPage } from "./ThankYouPage";

export class Pages{
    private page: Page
    mainPage: MainPage
    productListing: ProductsListing
    checkoutPage: CheckoutPage
    payments: Payments
    thankYouPage: ThankYouPage
    
    constructor(page: Page){
        this.page = page
        this.mainPage = new MainPage(page)
        this.productListing = new ProductsListing(page)
        this.checkoutPage = new CheckoutPage(page)
        this.payments = new Payments(page)
        this.thankYouPage = new ThankYouPage(page)
    }
}