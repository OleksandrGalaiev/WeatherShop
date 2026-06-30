import { Response, Locator, Page } from "@playwright/test";
import { BasePage } from "@POM/BasePage";


export class Payments extends BasePage{
    private email: Locator
    private cardNumber: Locator
    private ccExp: Locator
    private cvv: Locator
    private payBtn: Locator

    constructor(page: Page){
        super(page)
        this.email = this.page.locator('iframe[name="stripe_checkout_app"]').contentFrame().getByRole('textbox', { name: 'Email' })
        this.cardNumber = this.page.locator('iframe[name="stripe_checkout_app"]').contentFrame().getByRole('textbox', { name: 'Card number' })
        this.ccExp = this.page.locator('iframe[name="stripe_checkout_app"]').contentFrame().getByRole('textbox', { name: 'MM / YY' })
        this.cvv = this.page.locator('iframe[name="stripe_checkout_app"]').contentFrame().getByRole('textbox', { name: 'CVC' })
        this.payBtn = this.page.locator('iframe[name="stripe_checkout_app"]').contentFrame().getByRole('button', { name: 'Pay INR ₹' })
    }

    async fillCreditCardForm(userEmail:string, cardNumber:string, cardExp:string, cardCvv:string){
        await this.email.click()
        await this.email.pressSequentially(userEmail, {delay:150})
        await this.cardNumber.pressSequentially(cardNumber, {delay:150})
        await this.ccExp.pressSequentially(cardExp, {delay:100})
        await this.cvv.pressSequentially(cardCvv, {delay:100})
        const [paymentResponse] = await Promise.all([
            this.page.waitForResponse('https://api.stripe.com/v1/tokens', {'timeout':10000}),
            this.payBtn.click()
        ])
        return paymentResponse
    }

    getPaymentStatus(response: Response){
        return response.status()
    }

    getPaymentRequestData(response: Response){
        const postData = response.request().postData() ?? ''
        const params = new URLSearchParams(postData)
        return {
            email: params.get('email') ?? '',
            cardNumber: params.get('card[number]') ?? '',
            cardExpMonth: params.get('card[exp_month]') ?? '',
            cardExpYear: params.get('card[exp_year]') ?? '',
            cardCvc: params.get('card[cvc]') ?? ''
        }
    }

    async getPaymentResponseData(response:Response){
        const data = await response.json()
        return {
            token: data.token ?? '',
            funding: data.card?.funding ?? '',
            name: data.card?.name ?? ''
        }
    }


}