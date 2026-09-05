
import { test } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { createLogger } from '@utils/logger';

const log = createLogger('login.spec');

test.describe('TTACart - Login', () => {

    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);

        await test.step('Open the TTACart login page', async () => {
            log.info('Opening the TTACart login page');
            await loginPage.open();
        });
    });

    test('logs in with valid credentials @p0', async () => {

        await test.step('Login as standard_user', async () => {
            log.info('Logging in as standard_user');

            await loginPage.loginAs(
                'standard_user',
                'tta_secret'
            );
        });

    });

});