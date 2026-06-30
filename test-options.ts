import {test as base} from "@playwright/test"
import { Pages } from "@POM/Pages"


export type TestOptions = {
    weatherShop:string,
    app: Pages
}

export const test = base.extend<TestOptions>({
    weatherShop:['',{option:true}],
    app: async({page}, use)=>{
        const pages = new Pages(page)
        await use(pages)
    }
})
