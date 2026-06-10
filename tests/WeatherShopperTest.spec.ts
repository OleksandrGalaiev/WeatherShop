import { expect } from "@playwright/test"
import {test} from "../test-options"
import { getFakeUser } from "../utils/FakePerson"
import { CosmeticStore } from "../interfaces/CosmeticStore"

test.describe('Weather Shopper: Product Selection Logic', async()=>{

const cosmeticStore: CosmeticStore[] = [
    {temperature:15, category:'moisturizers',product1:'Aloe', product1PriceLevel:'min', product2:'Almond', product2PriceLevel:'min'},
    {temperature:35, category:'sunscreens',product1:'SPF-50', product1PriceLevel:'min', product2:'SPF-30', product2PriceLevel:'min'}
]
for(const{temperature, category, product1,product1PriceLevel, product2, product2PriceLevel} of cosmeticStore){
     test(`User should successfully purchase ${category} when temmperature is ${temperature}`, async({app, weatherShop})=>{
        let fakePerson = getFakeUser('en')
        await test.step(`Artificially set temperature to ${temperature}°C`, async()=>{
            await app.mainPage.setupTemperatureRoute(temperature)
        })
        await test.step(`Open main page, check preconditions and switch to ${category} screen`, async()=>{
            await app.mainPage.open(weatherShop)
            expect(await app.mainPage.getCurrentTemperature(), 'Not correct temperature installed').toContain(temperature.toString())
            await app.mainPage.buyProduct(category)
        })
        await test.step(`Add product ${product1} to card with ${product1PriceLevel} price`,async()=>{
            await app.productListing.addProductToCard(product1, product1PriceLevel)
        })
        await test.step(`Add product ${product2} to card with ${product2PriceLevel} price. And oprn card`, async()=>{
            await app.productListing.addProductToCard(product2, product2PriceLevel)
            await app.productListing.cart.click()
        })
        await test.step('Checking the visibility of the purchased item and paying by credit card', async ()=>{
            expect(await app.checkoutPage.getContentOfTable(product1), 'Product is not been added to card').toBeVisible()
            expect.soft(await app.checkoutPage.getContentOfTable(product2), 'Product is not been added to card').toBeVisible()
            await app.checkoutPage.buyViaCreditCard()
            let paymentResponse = await app.payments.fillCreditCardForm(
                fakePerson.email, 
                process.env.CARD_NUMBER || '',
                process.env.EXPIRATION_DATE || '',
                process.env.CVV || ''
            )
            expect(await app.payments.getPaymentStatus(paymentResponse), 'Payment is not succesful').toEqual(200)
            let receivedData = await app.payments.getPaymentResponseData(paymentResponse)
            expect(receivedData.token).toEqual('token')
            expect(receivedData.name, 'incorrect user email').toEqual(fakePerson.email)
            expect(receivedData.funding, 'incorrect type of funding').toEqual('credit')

            
        })
        await test.step("Check Thank you page", async()=>{
            expect(await app.thankYouPage.getTitleText()).toEqual('PAYMENT SUCCESS')
        })
    })}
})
