# Weather Shopper Autotests — Project Guide for Claude

## Overview

End-to-end test framework for the **Weather Shopper** demo application
(`https://weathershopper.pythonanywhere.com/`). The suite validates the
temperature-dependent product selection flow (moisturizers below 19°C,
sunscreens above 34°C), cart interactions, and the Stripe-backed credit card
checkout.

- **Language:** TypeScript (CommonJS)
- **Test runner:** Playwright Test (`@playwright/test`)
- **Fake data:** `@faker-js/faker`
- **Env loading:** `dotenv`
- **CI:** GitHub Actions (`.github/workflows/playwright.yml`) on push / PR to `main` or `master`

## Directory Layout

```
.
├── .github/workflows/playwright.yml   # CI pipeline (Node LTS, Chromium, HTML report artifact)
├── POM/                               # Page Object Model
│   ├── BaseTest.ts                    # Aggregator: instantiates all page objects + open(url)
│   ├── MainPage.ts                    # Landing page + temperature route override
│   ├── ProductListting.ts             # Product listing, min/max price selection logic
│   ├── CheckoutPage.ts                # Cart/checkout table, "Pay with Card" trigger
│   └── ThankYouPage.ts                # Post-payment confirmation page
├── helpers/
│   └── Payments.ts                    # Stripe iframe credit card form helper
├── interfaces/
│   └── CosmeticStore.ts               # Types: ProductCategory, PriceLevel, CosmeticStore
├── utils/
│   └── FakePerson.ts                  # getFakeUser(locale) — returns fake name/email
├── tests/
│   └── WeatherShopperTest.spec.ts     # Data-driven specs (cold + hot scenarios)
├── test-options.ts                    # Extends Playwright test with { app, weatherShop }
├── playwright.config.ts               # Chromium project, baseURL, retries on CI
├── package.json
└── .env                               # CARD_NUMBER, CVV, EXPIRATION_DATE (gitignored)
```

## Architecture

### Page Object Model via Fixture Aggregation
[test-options.ts](../test-options.ts) extends Playwright's base `test` with a
single `app` fixture — a `BaseTest` instance that wires every page object
together. Specs receive the whole app surface by destructuring `{ app, weatherShop }`,
keeping individual test files free of constructor noise.

```ts
test(`…`, async ({ app, weatherShop }) => {
  await app.open(weatherShop);
  await app.mainPage.buyProduct(category);
  await app.productListing.addProductToCard(product1, product1PriceLevel);
  // …
});
```

### Temperature Route Interception
[POM/MainPage.ts:13-23](../POM/MainPage.ts#L13-L23) uses `page.route` to rewrite
the `<span id="temperature">` value before the page renders, so tests
deterministically drive the hot/cold branching instead of depending on live
weather data.

### Price-Level Product Picking
[POM/ProductListting.ts:15-30](../POM/ProductListting.ts#L15-L30) collects all
cards matching a substring (e.g. `'Aloe'`, `'SPF-50'`), parses their prices,
and reduces to either `min` or `max` via the `PriceLevel` union type.

### Data-Driven Tests
[tests/WeatherShopperTest.spec.ts:8-11](../tests/WeatherShopperTest.spec.ts#L8-L11)
iterates over a `CosmeticStore[]` array — each entry generates a full test via
a `for` loop, so new scenarios are added by appending to the array.

### Custom Project Option `weatherShop`
`playwright.config.ts` declares `weatherShop` alongside `baseURL` in the
Chromium project; `test-options.ts` surfaces it as a typed fixture. Tests use
it instead of `baseURL` so the URL is explicitly injected.

## Running

```bash
npm ci
npx playwright install --with-deps
npx playwright test
npx playwright show-report      # open HTML report
```

`.env` (gitignored) must define:

```
CARD_NUMBER=<stripe test card, e.g. 4242424242424242>
CVV=<3 digits>
EXPIRATION_DATE=<MM/YY>
```

## Conventions & Gotchas

- **CommonJS, not ESM** — `package.json` sets `"type": "commonjs"`; keep imports TS-style without `.js` suffixes.
- **Mixed Playwright imports** — some POM files import `Page`/`Locator` from `playwright` (core) while others use `@playwright/test`. Both resolve, but prefer `@playwright/test` in new files.
- **File naming** — `ProductListting.ts` has a typo (double `t`). Preserve when importing; renaming needs a coordinated update of `POM/BaseTest.ts`.
- **Stripe form filling bug** — [helpers/Payments.ts:23](../helpers/Payments.ts#L23) calls `this.email.pressSequentially(cardNumber, …)` (should be `this.cardNumber`). Known issue; fix when touching that file.
- **CI runs Chromium only** — Firefox/WebKit projects are commented out in `playwright.config.ts`. Re-enable intentionally.
- **Retries** — 2 on CI, 0 locally. Trace is captured on first retry only.
- **Parallelism** — `fullyParallel: true` locally, serialized (`workers: 1`) on CI.
- **Secrets never logged** — `CARD_NUMBER`/`CVV`/`EXPIRATION_DATE` come from env; don't echo them in steps or reporters.

## Extending the Suite

- **New scenario** → add a row to the `cosmeticStore` array in the spec.
- **New page** → create a class in `POM/`, wire it into `BaseTest` constructor, and it becomes available as `app.<name>` everywhere.
- **New domain type** → add to `interfaces/CosmeticStore.ts`.
- **New fixture** → extend `TestOptions` in `test-options.ts`.
