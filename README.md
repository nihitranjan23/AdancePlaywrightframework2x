# Advance Playwright Framework 2X

A comprehensive Playwright test automation framework featuring custom TTA reporting, video recording, screenshots, trace collection, fixture-based architecture, and multi-environment support.

## Features

- **Custom TTA Reporter** — Beautiful HTML report with real-time test execution tracking, embedded videos, and flaky test analysis
- **Video Recording** — All tests are recorded and embedded in the report
- **Screenshots** — Captured automatically on test failure
- **Trace Collection** — Full Playwright traces available for debugging via `npx playwright show-trace`
- **Fixture-Based Architecture** — Pre-wired page objects and state fixtures for reusable setup
- **Multi-Environment Support** — QA, Dev, Staging, Production, and API configurations via `.env`
- **Page Object Model (POM)** — Maintainable test architecture with clean separation of concerns
- **Winston Logging** — Structured logging throughout test execution
- **Visual Steps** — Human-readable step annotations in reports
- **Data Generator** — Faker-backed fake data for deterministic test data generation

## Project Structure

```
├── src/
│   ├── tests/              # Test files (specs)
│   │   ├── e2e/            # End-to-end test suites
│   │   └── login/          # Login feature tests
│   ├── pages/              # Page Object Models
│   ├── fixtures/           # Playwright test fixtures
│   ├── config/             # Configuration (credentials, env)
│   ├── testdata/           # Static test data (JSON)
│   ├── utils/              # Utilities (reporter, logger, visualStep, etc.)
│   └── ai/                 # AI agents for analysis
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables (not committed)
├── .env.example            # Example environment file
└── README.md               # This file
```

## Setup

```bash
npm install
npx playwright install
```

### Environment Configuration

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

**Important:** `.env` is listed in `.gitignore` and should **never** be committed to version control.

Example `.env`:
```env
TTA_ENV=qa
BASE_URL=https://app.thetestingacademy.com
QA_BASE_URL=https://app.thetestingacademy.com
STG_BASE_URL=https://stage.thetestingacademy.com
PROD_BASE_URL=https://app.thetestingacademy.com
DEV_BASE_URL=http://localhost:3000
API_BASE_URL=https://restful-booker.herokuapp.com
LOG_LEVEL=info
TEST_ENV=QA
TEST_AUTHOR=YourName
```

## Running Tests

### Using NPM Scripts

```bash
# Run all tests
npm test

# Or using npx directly
npx playwright test
```

### Common Commands

```bash
# Run specific test file
npx playwright test src/tests/e2e/e2e-checkout.spec.ts

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run with UI mode
npx playwright test --ui

# Run with debug mode
npx playwright test --debug

# Run specific project (browser)
npx playwright test --project=chromium

# Run tests matching a tag
npx playwright test --grep "@p0"
```

## Fixtures

This framework uses Playwright fixtures to provide pre-constructed page objects and reusable test states.

### Available Fixtures

| Fixture | Description |
|---------|-------------|
| `loginPage` | Pre-constructed `LoginPage` object |
| `inventoryPage` | Pre-constructed `InventoryPage` object |
| `cartPage` | Pre-constructed `CartPage` object |
| `checkoutStepOnePage` | Pre-constructed `CheckoutStepOnePage` object |
| `checkoutStepTwoPage` | Pre-constructed `CheckoutStepTwoPage` object |
| `checkoutCompletePage` | Pre-constructed `CheckoutCompletePage` object |
| `itemDetailPage` | Pre-constructed `ItemDetailPage` object |
| `invalidLogin` | State fixture: logs in with invalid credentials |
| `validLogin` | State fixture: logs in with valid credentials |
| `loginWithInventory` | State fixture: logged in and on inventory page |
| `loginWithSelectedItem` | State fixture: logged in with an item added to cart |

### Usage Example

```typescript
import { test, expect } from '@fixtures/test-base';

test('should add item to cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('test-allthethings-tshirt-red');
    await cartPage.open();
    expect(await cartPage.rowCount()).toBe(1);
});
```

## Configuration

### Reporters

The framework uses multiple reporters:
- **HTML Reporter** — Playwright's built-in HTML report (`playwright-report/`)
- **List Reporter** — Console output with test progress
- **Custom TTA Reporter** — Advanced HTML report with videos, traces, and build comparison (`tta-report/`)

### Test Artifacts

Configured in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',   // Screenshots on failure
  video: 'retain-on-failure',      // Video only for failed tests
  trace: 'on-first-retry'          // Trace on first retry
}
```

> **Note:** By default, tests run in **headless** mode. Use `--headed` flag for visible browser.

### Environments

Set environment via `TTA_ENV`:
- `qa` (default)
- `dev` / `local`
- `stg` / `stage` / `staging`
- `prod` / `production`
- `api`

## Reports

### Custom TTA Report

Located in `tta-report/` directory:
- `index.html` — Redirects to latest report
- `report_YYYYMMDD_HHMMSS.html` — Individual test run reports
- `history.html` — Report history page

Features:
- Test results table with sortable columns
- Embedded video player for each test
- Downloadable trace files
- Screenshot gallery (on failure)
- Test step breakdown with timing
- Console logs per test
- AI Data tab for generated test data
- AI Verdict tab for failure analysis
- Flaky test analysis across builds

### Playwright HTML Report

Located in `playwright-report/` directory:
- Standard Playwright HTML report
- Trace viewer integration

## Viewing Traces

After a test run, open the trace viewer to inspect test execution:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Credentials

Default test credentials are defined in `src/config/credentials.ts`:
- **Standard User:** `standard_user` / `tta_secret`
- **Locked Out User:** `locked_out_user` / `tta_secret`

## License

ISC
