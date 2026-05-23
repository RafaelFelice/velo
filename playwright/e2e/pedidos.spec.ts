import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Consulta de pedidos', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  });

  test('deve buscar um pedido aprovado com sucesso', async ({ page }) => {
    const order = {
      number: 'VLO-DK2CYM',
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fulano Silva',
        email: 'fulano@qa.com',
      },
      payment: 'À Vista',
    };

    await page.getByTestId('search-order-id').fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' });
    await expect(statusBadge).toHaveClass(/bg-green-100/);
    await expect(statusBadge).toHaveClass(/text-green-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);
  });

  test('deve buscar um pedido reprovado com sucesso', async ({ page }) => {
    const order = {
      number: 'VLO-5S63RM',
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Stanley Copo',
        email: 'stanley@teste.com',
      },
      payment: 'À Vista',
    };

    await page.getByTestId('search-order-id').fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: REPROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO' });
    await expect(statusBadge).toHaveClass(/bg-red-100/);
    await expect(statusBadge).toHaveClass(/text-red-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-circle-x/);
  });

  test('deve buscar um pedido em análise com sucesso', async ({ page }) => {
    const order = {
      number: 'VLO-BPVJIW',
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'Café Premium',
        email: 'cafe@teste.com',
      },
      payment: 'À Vista',
    };

    await page.getByTestId('search-order-id').fill(order.number);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: EM_ANALISE
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    const statusBadge = page.getByRole('status').filter({ hasText: 'EM_ANALISE' });
    await expect(statusBadge).toHaveClass(/bg-amber-100/);
    await expect(statusBadge).toHaveClass(/text-amber-700/);

    const statusIcon = statusBadge.locator('svg');
    await expect(statusIcon).toHaveClass(/lucide-clock/);
  });

  test('deve buscar um pedido que não existe', async ({ page }) => {
    const order = generateOrderCode();

    await page.getByTestId('search-order-id').fill(order);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);
  });

});
