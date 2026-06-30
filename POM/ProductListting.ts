import { Locator, Page } from "@playwright/test";
import { PriceLevel } from "@interfaces/CosmeticStore";
import { BasePage } from "@POM/BasePage";

export class ProductsListing extends BasePage{
    private productCard: Locator
    private cart: Locator
    
    constructor(page:Page){
        super(page)
        this.productCard = page.locator("//div[contains(@class, 'col-4')]").first()
        this.cart = page.locator("#cart")
    }

    async addProductToCard(productName:string, price:PriceLevel){
        await this.productCard.waitFor({state:'visible'})
        const allProductsLocators = await this.getAllProductsLocators(productName)
        
        const productPrices = await this.getListOfPrices(allProductsLocators)
        if (productPrices.length === 0) {
            throw new Error(`Product with ${productName} component is not found`);
        }
        const targetProduct = productPrices.reduce((prev, current) => {
            if (price === 'min') {
                return (current.price < prev.price) ? current : prev;
            } else {
                return (current.price > prev.price) ? current : prev;
            }
        })
        await targetProduct.locator.scrollIntoViewIfNeeded({'timeout':500})
        await targetProduct.locator.locator("button").filter({hasText: "Add"}).click()
    }

    private async getAllProductsLocators(productName:string){
        return await this.page.locator("//div[contains(@class, 'col-4')]").filter({hasText: productName}).all()
    }

    private async getListOfPrices(allProductsLocators:Locator[]){
        return await Promise.all(allProductsLocators.map(async (locator) => {
            const priceText = await locator.locator("p").filter({hasText: "Price"}).textContent()
            const match = priceText!.match(/\d+/)
            return {
                locator,
                price: parseInt(match![0], 10)
            }
        }))
    }

    getCartStatus(){
        return this.cart
    }

    async openShopingBusket(){
        await this.cart.click()
    }

    async waitForProductTobeAdded(numberOfItems: number){
        const busketText = this.page.locator(`//span[text()='${numberOfItems} item(s)']`)
        await busketText.waitFor({'state':'visible'})
    }
}