# Advance Playwright Framework

A comprehensive Playwright test automation framework with custom reporting, video recording, screenshots, and trace collection.

## Features

- **Custom TTA Reporter** - Beautiful HTML report with real-time test execution tracking
- **Video Recording** - All tests are recorded and embedded in the report
- **Screenshots** - Captured automatically on test failure
- **Trace Collection** - Full Playwright traces available for debugging
- **Multi-environment Support** - QA, Dev, Staging, Production configurations
- **Page Object Model** - Maintainable test architecture
- **Winston Logging** - Structured logging throughout test execution

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test src/tests/login.spec.ts

# Run in headed mode (visible browser)
npx playwright test src/tests/login.spec.ts --headed

# Run with specific reporter
npx playwright test --reporter=list,html
```

## Configuration

### Reporters

The framework uses multiple reporters:
- **HTML Reporter** - Playwright's built-in HTML report (`playwright-report/`)
- **List Reporter** - Console output with test progress
- **Custom TTA Reporter** - Advanced HTML report with videos, traces, and AI analysis (`tta-report/`)

### Test Artifacts

Configured in `playwright.config.ts`:

```typescript
use: {
  screenshot: 'only-on-failure',  // Screenshots on failure
  video: 'on',                    // Video for all tests
  trace: 'on'                     // Traces for all tests
}
```

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
- `index.html` - Redirects to latest report
- `report_YYYYMMDD_HHMMSS.html` - Individual test run reports
- `history.html` - Report history page

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

## Project Structure

```
├── src/
│   ├── tests/           # Test files
│   ├── pages/           # Page Object Models
│   ├── utils/           # Utilities (reporter, logger, etc.)
│   └── ai/              # AI agents for analysis
├── playwright.config.ts # Playwright configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## License

ISC
