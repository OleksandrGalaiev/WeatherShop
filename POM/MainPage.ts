import { Locator, Page } from "@playwright/test"
import { BasePage } from "./BasePage"


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
            /<span id="temperature">.*?<\/span>/is,
            `<span id="temperature">${temperature} <sup>&nbsp;°C</sup></span>`
        );
            await route.fulfill({ response, body: html });
        });
    }

    async getCurrentTemperature(){
        await this.temperatureValue.waitFor({'state':'visible'})
        return await this.temperatureValue.textContent()
    }

    async buyProduct(productName:'moisturizers'|'sunscreens'){
        await this.page.locator(`//button[text()='Buy ${productName}']`).click()
    }

    async open(url: string): Promise<void> {
        await super.open(url)
        await this.temperatureValue.waitFor({state:'visible'})
    }
}