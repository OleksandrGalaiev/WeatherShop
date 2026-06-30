import { expect } from "@playwright/test"
import {test} from "../test-options"
import { getFakeUser } from "@utils/FakePerson"
import { CosmeticStore } from "@interfaces/CosmeticStore"

test.describe('Weather Shopper: Product Selection Logic', ()=>{

const cosmeticStore: CosmeticStore[] = [
    {temperature:15, category:'moisturizers',product1:'Aloe', product1PriceLevel:'min', product2:'Almond', product2PriceLevel:'min'},
    {temperature:35, category:'sunscreens',product1:'SPF-50', product1PriceLevel:'min', product2:'SPF-30', product2PriceLevel:'min'}
]
for(const{temperature, category, product1,product1PriceLevel, product2, product2PriceLevel} of cosmeticStore){
     test(`User should successfully purchase ${category} when temmperature is ${temperature}`, async({app, weatherShop})=>{
        const fakePerson = getFakeUser('en')

        await test.step(`Artificially set temperature to ${temperature}°C`, async()=>{
            await app.mainPage.setupTemperatureRoute(temperature)
        })

        await test.step(`Open main page, check preconditions and switch to ${category} screen`, async()=>{
            await app.mainPage.open(weatherShop)
            await expect(app.mainPage.getCurrentTemperature(), 'Not correct temperature installed').toHaveText(new RegExp(`^${temperature}`))
            await app.mainPage.buyProduct(category)
        })

        await test.step(`Add product ${product1} to card with ${product1PriceLevel} price`,async()=>{
            await app.productListing.addProductToCard(product1, product1PriceLevel)
            await app.productListing.waitForProductTobeAdded(1)
        })

        await test.step(`Add product ${product2} to card with ${product2PriceLevel} price. And open card`, async()=>{
            await app.productListing.addProductToCard(product2, product2PriceLevel)
            await app.productListing.openShopingBusket()
        })

        await test.step('Checking the visibility of the purchased item and paying by credit card', async ()=>{
            await expect(app.checkoutPage.getContentOfTable(product1), 'Product is not been added to card').toBeVisible()
            await expect.soft(app.checkoutPage.getContentOfTable(product2), 'Product is not been added to card').toBeVisible()
            await app.checkoutPage.buyViaCreditCard()
        })

        await test.step('Fill credit card credentials and check request data', async()=>{
            const paymentResponse = await app.payments.fillCreditCardForm(
                fakePerson.email, 
                process.env.CARD_NUMBER || '',
                process.env.EXPIRATION_DATE || '',
                process.env.CVV || ''
            )
            expect(app.payments.getPaymentStatus(paymentResponse), 'Payment is not succesful').toBe(200)
            const sentData = app.payments.getPaymentRequestData(paymentResponse)
            expect(sentData.email, 'incorrect email in payload').toBe(fakePerson.email)
            expect(sentData.cardNumber.replace(/\s/g, ''), 'incorrect card number in payload').toBe((process.env.CARD_NUMBER || '').replace(/\s/g, ''))
            expect(sentData.cardCvc, 'incorrect cvc in payload').toBe(process.env.CVV || '')
        })
      
        await test.step("Check Thank you page", async()=>{
            await expect(await app.thankYouPage.getTitleText()).toHaveText('PAYMENT SUCCESS')
        })
    })}
})
