import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {

    return {
        async open() {
            await page.goto('/configure')
        },

        async selectColor(name: string) {
            await page.getByRole('button', { name }).click()
        },

        async selectWheels(name: string | RegExp) {
            await page.getByRole('button', { name }).click()
        },

        async toggleOptional(name: string | RegExp) {
            const optional = page.getByRole('checkbox', { name })
            await optional.click()
            await expect(optional).toBeChecked()
        },

        async untoggleOptional(name: string | RegExp) {
            const optional = page.getByRole('checkbox', { name })
            await optional.click()
            await expect(optional).not.toBeChecked()
        },

        async clickCheckout() {
            await page.getByRole('button', { name: 'Monte o Seu' }).click()
        },

        async expectPrice(price: string) {
            const priceElement = page.getByTestId('total-price')
            await expect(priceElement).toBeVisible()
            await expect(priceElement).toHaveText(price)
        },

        async expectCarImageSrc(src: string) {
            const carImage = page.locator('img[alt^="Velô Sprint"]')
            await expect(carImage).toHaveAttribute('src', src)
        },
    }
}
