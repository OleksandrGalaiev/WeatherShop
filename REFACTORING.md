* **POM Optimization:** Introduced `BasePage.ts` to share common methods across all page objects. Renamed `BaseTest` to `Pages` to act as a centralized page factory/container.
* **Network Interception:** Improved `page.route()` logic for more stable UI mocking and to prevent race conditions.
* **Locator Strategy:** Migrated to Web-First locators for the payment modal to handle DOM rendering delays and eliminate flakiness.
* **API Assertions:** Added strict payload validation for payment gateway API responses (verifying tokens and card data).
* **General Cleanup:** Minor refactoring of helper functions and locators for better maintainability.

## Roadmap

* **CI/CD Integration:** Set up automated test execution pipelines (e.g., GitHub Actions).
* **Negative Testing:** Use `page.route()` to mock backend failures (HTTP 400/500) and verify UI error handling.
* **API Testing:** Implement direct API tests via `APIRequestContext` bypassing the UI.
* **Extended UI Coverage:** Add detailed content validation for product cards