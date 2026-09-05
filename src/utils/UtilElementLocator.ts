// Whatever the common utilities are there, it will be present in the util element locator.

/**
 * This is UtilElementLocators - Contains all the util we can reuse directly
 * 
 **/

// Import expect (for assertions), Locator (Playwright's element handle), and Page (browser page) from Playwright test package.
import { expect, Locator, Page } from '@playwright/test';

// Import createLogger function and Logger type from the logger utility file.
// The @utils alias maps to the utils folder, making imports cleaner.
import { createLogger, type Logger } from './logger';

// Define a constant for the default maximum time (15 seconds) any action should wait before failing.
// The underscore in 15_000 is just for readability; JavaScript treats it as 15000.
export const DEFAULT_ACTION_TIMEOUT_MS = 15_000;


/**
 * Flex - a selector can be a CSS string or an already-built Locator.
 *
 * The TTACart suite uses `data-test` attributes everywhere, so most call sites
 * pass either:
 *   - `'[data-test="username"]'`  (a CSS string), or
 *   - `page.getByTestId('username')` (a Locator object).
 */

// Create a custom type alias called Flex.
// It means: "Flex can be either a plain text string (CSS selector) OR a Playwright Locator object."
// This allows methods in this class to accept both formats flexibly.
export type Flex = string | Locator;

// Define the UtilElementLocator class that wraps common Playwright element actions with logging.
export class UtilElementLocator {
    // Declare a private read-only property to hold the Playwright Page instance.
    // Private = only this class can access it. Readonly = set once in constructor, never changed.
    private readonly page: Page;

    // Declare a private read-only property to hold the logger instance for this class.
    private readonly log: Logger;

    // Constructor: runs when you create a new UtilElementLocator object.
    // Requires a Playwright Page object. Optionally accepts a scope name for the logger (defaults to 'UtilElementLocator').
    constructor(page: Page, scope: string = 'UtilElementLocator') {
        // Save the provided page into the class property so methods can use it.
        this.page = page;
        // Create a scoped logger using the provided scope name, so log messages show which class generated them.
        this.log = createLogger(scope);
    }

    // Private helper method: converts a Flex (string or Locator) into a guaranteed Playwright Locator.
    // Private = only used inside this class, not accessible from outside.
    private toLocator(target: Flex): Locator {
        // Check if target is a string (CSS selector).
        // If yes, convert it to a real Playwright Locator using page.locator().
        // If no (it's already a Locator), just return it as-is.
        return typeof target === 'string' ? this.page.locator(target) : target;
    }

    /** Human-readable label for a target, used only in log lines. */
    // Private helper method: generates a string description of the target for logging purposes.
    private describe(target: Flex): string {
        // If target is a string, return the string itself (the selector text).
        // If target is a Locator, convert it to its string representation.
        return typeof target === 'string' ? target : target.toString();
    }

    // ---------- mouse actions ----------

    // Public method: clicks on an element (target).
    // Accepts a Flex target and an optional timeout (defaults to 15 seconds).
    async click(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert the target (string or Locator) into a proper Playwright Locator.
        const loc = this.toLocator(target); // Checking if it is a normal locator or a Playwright locator.
        // Log a debug message showing what element is being clicked.
        this.log.debug(`click ${this.describe(target)}`);
        // Perform the actual click action, passing the timeout so it doesn't wait forever.
        await loc.click({ timeout });
    }

    // Public method: double-clicks on an element.
    async doubleClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Log the double-click action for debugging.
        this.log.debug(`Double_click ${this.describe(target)}`);
        // Perform the double-click using Playwright's dblclick method.
        await loc.dblclick({ timeout });
    }

    // Public method: right-clicks (context menu click) on an element.
    async rightClick(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Log the right-click action.
        this.log.debug(`rightClick ${this.describe(target)}`);
        // Perform a click with the 'right' mouse button.
        await loc.click({ button: 'right', timeout });
    }

    // Public method: hovers the mouse cursor over an element.
    async hover(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Move the mouse over the element, with a timeout.
        await loc.hover({ timeout });
    }

    // ---------- input actions ----------

    // Public method: clears an input field and types the given value into it.
    async fill(target: Flex, value: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Log the fill action.
        this.log.debug(`fill ${this.describe(target)}`);
        // Fill the input with the provided text, replacing any existing text.
        await loc.fill(value, { timeout });
    }

    // Public method: simulates typing characters one by one into an input field.
    async type(target: Flex, value: string, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Note: Playwright deprecated .type() in favour of .pressSequentially().
        // We keep the public method name so the API still reads naturally for
        // students used to the older verb.
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Use pressSequentially to type each character with realistic delays (simulates human typing).
        await loc.pressSequentially(value, { timeout });
    }

    // Public method: clears the content of an input field or text area.
    async clear(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Clear the field's current value.
        await loc.clear({ timeout });
    }

    // Public method: types text character by character (modern replacement for .type()).
    async pressSequentially(
        target: Flex,
        value: string,
        timeout: number = DEFAULT_ACTION_TIMEOUT_MS,
    ): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Simulate pressing each key sequentially to enter the text.
        await loc.pressSequentially(value, { timeout });
    }

    // ---------- text & content getters ----------

    // Public method: gets the visible text content of an element.
    async getText(target: Flex): Promise<string> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // textContent() returns the text inside the element, or null if none.
        // Use ?? '' to fallback to empty string if null, then trim whitespace.
        const txt = (await loc.textContent()) ?? '';
        return txt.trim();
    }

    // Public method: gets the inner text of an element (respects CSS visibility, unlike textContent).
    async getInnerText(target: Flex): Promise<string> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // innerText returns the rendered text as the user sees it, then trim extra spaces.
        return (await loc.innerText()).trim();
    }

    // Public method: gets text content from ALL matching elements (returns an array of strings).
    async getAllTexts(target: Flex): Promise<string[]> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // allTextContents() returns an array of texts from every matched element.
        const texts = await loc.allTextContents();
        // Trim whitespace from each text entry in the array.
        return texts.map((t) => t.trim());
    }

    // Public method: gets the value of a specific HTML attribute (e.g., 'href', 'src', 'class').
    async getAttr(target: Flex, name: string): Promise<string | null> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return the attribute value, or null if the attribute doesn't exist.
        return loc.getAttribute(name);
    }

    // Public method: gets the current value of an input field (useful for <input>, <textarea>, <select>).
    async getValue(target: Flex): Promise<string> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return whatever text/value is currently entered in the input.
        return loc.inputValue();
    }

    // ---------- count ----------

    // Public method: counts how many elements match the given selector/Locator.
    async count(target: Flex): Promise<number> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return the total number of matched elements.
        return loc.count();
    }

    // ---------- state checks ----------

    // Public method: checks if an element is currently visible on the page.
    async isVisible(target: Flex): Promise<boolean> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return true if the element is visible, false otherwise.
        return loc.isVisible();
    }

    // Public method: checks if an element is enabled (not disabled).
    async isEnabled(target: Flex): Promise<boolean> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return true if the element is enabled and can be interacted with.
        return loc.isEnabled();
    }

    // Public method: checks if a checkbox or radio button is checked.
    async isChecked(target: Flex): Promise<boolean> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Return true if the checkbox/radio is checked, false otherwise.
        return loc.isChecked();
    }

    // ---------- waits ----------

    // Public method: waits until an element becomes visible, failing if timeout is reached.
    async waitForVisible(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Use Playwright's expect assertion to wait until the element is visible.
        await expect(loc).toBeVisible({ timeout });
    }

    // Public method: waits until an element becomes hidden (disappears from the page).
    async waitForHidden(target: Flex, timeout: number = DEFAULT_ACTION_TIMEOUT_MS): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Use Playwright's expect assertion to wait until the element is hidden.
        await expect(loc).toBeHidden({ timeout });
    }

    // Public method: waits for the entire page to finish loading.
    async waitForPageLoad(): Promise<void> {
        // Log that we are waiting for the page to load.
        this.log.debug('waitForPageLoad');
        // First wait until the basic HTML structure (DOM) is loaded.
        await this.page.waitForLoadState('domcontentloaded');
        // Then wait until network activity settles down (no ongoing network requests).
        // .catch() is used to swallow any timeout error silently so the test isn't punished
        // by background analytics calls on the demo origin.
        await this.page.waitForLoadState('networkidle').catch(() => {
            // TTACart is static + localStorage so networkidle is fast,
            // but we swallow the rare timeout so the test isn't punished
            // by background analytics calls on the demo origin.
        });
    }

    // ---------- selects ----------

    // Public method: selects an option from a dropdown by its visible label text.
    async selectByText(target: Flex, text: string): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Select the option whose label (visible text) matches the provided text.
        await loc.selectOption({ label: text });
    }

    // Public method: selects an option from a dropdown by its HTML value attribute.
    async selectByValue(target: Flex, value: string): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Select the option whose 'value' attribute matches the provided value.
        // { value } is shorthand for { value: value }.
        await loc.selectOption({ value });
    }

    // Public method: selects an option from a dropdown by its zero-based index position.
    async selectByIndex(target: Flex, index: number): Promise<void> {
        // Convert target to a Locator.
        const loc = this.toLocator(target);
        // Select the option at the given index (0 = first option).
        await loc.selectOption({ index });
    }
}
