import {en, de, uk,Faker} from "@faker-js/faker"


interface FakeUser {
    name: string,
    lastName: string,
    email: string,
}

type Locale = 'en'|'de'|'fa'

const locales = {
    en:en,
    de:de,
    uk:uk,
}

export function getFakeUser(userLocale: Locale):FakeUser{
    const user = new Faker({locale:locales[userLocale]})
    return {
        name: user.person.firstName(),
        lastName: user.person.lastName(),
        email: user.internet.email()
    }
}