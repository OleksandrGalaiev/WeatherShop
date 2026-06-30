import { Locator, Page } from "@playwright/test"
import { BasePage } from "@POM/BasePage"


export class MainPage extends BasePage{
    private temperatureValue: Locator

    constructor(page:Page){
        super(page)
        this.temperatureValue = page.locator("#temperature")
    }

    async setupTemperatureRoute(temperature: number) {
        await this.page.route('**/weathershopper.pythonanywhere.com{,/}', async (route) => {
            const response = await route.fetch();
            let html = await response.text();
            html = html.replace(
                /<script type="text\/javascript">[\s\S]*?<\/script>/i,
                `<script type="text/javascript">document.getElementById("weather").innerHTML = '<span id="temperature">${temperature} <sup>&nbsp;°C</sup></span>';</script>`
            );
            await route.fulfill({ response, body: html });
        });
    }

    getCurrentTemperature(){
        return this.temperatureValue
    }

    async buyProduct(productName:'moisturizers'|'sunscreens'){
        await this.page.getByRole('button',{'name':productName}).click()
        await this.page.waitForFunction(() => typeof (window as unknown as { addToCart?: unknown }).addToCart === 'function')
    }

    async open(url: string): Promise<void> {
        await super.open(url)
        await this.temperatureValue.waitFor({state:'visible'})
    }
}