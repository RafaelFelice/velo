import { test, expect } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
    test.beforeEach(async ({ page, app }) => {
        await page.goto('/configure')
        await page.evaluate(() => window.localStorage.clear())
        await page.reload()
        await app.configurator.expectPrice('R$ 40.000,00')
    })

    test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
        await app.configurator.selectColor('Midnight Black')
        await app.configurator.expectPrice('R$ 40.000,00')

        await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
    })

    test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrões', async ({ app }) => {
        await app.configurator.selectWheels(/Sport Wheels/)
        await app.configurator.expectPrice('R$ 42.000,00')

        await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')
        
        await app.configurator.selectWheels(/Aero Wheels/)
        await app.configurator.expectPrice('R$ 40.000,00')

        await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
    })

    test('deve atualizar o preço ao adicionar opcionais e persistir os valores no checkout', async ({ page, app }) => {
        await app.configurator.toggleOptional(/Precision Park/)
        await app.configurator.expectPrice('R$ 45.500,00')

        await app.configurator.toggleOptional(/Flux Capacitor/)
        await app.configurator.expectPrice('R$ 50.500,00')

        await app.configurator.untoggleOptional(/Precision Park/)
        await app.configurator.untoggleOptional(/Flux Capacitor/)
        await app.configurator.expectPrice('R$ 40.000,00')

        await app.configurator.toggleOptional(/Precision Park/)
        await app.configurator.toggleOptional(/Flux Capacitor/)
        await app.configurator.clickCheckout()

        await expect(page).toHaveURL(/\/order$/)
        await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
        await expect(page.getByTestId('summary-total-price')).toHaveText('R$ 50.500,00')
    })
})