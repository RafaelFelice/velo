/**
 * Gera um código de pedido com prefixo fixo e 6 caracteres alfanuméricos aleatórios.
 * @param {string} prefix - O prefixo do pedido (padrão: 'VLO')
 * @returns {string} Código do pedido
 */
export function generateOrderCode(prefix = 'VLO') {
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
  
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumeric.length);
      suffix += alphanumeric[randomIndex];
    }
  
    return `${prefix}-${suffix}`;
  }