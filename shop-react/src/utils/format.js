const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export const FREE_DELIVERY_FROM = 10000

export function formatPrice(value) {
  return priceFormat.format(value)
}

export function calculateDiscount(total, promoCode) {
  if (!promoCode) return 0
  if (promoCode.trim().toUpperCase() === 'STUDENT10') {
    return Math.round(total * 0.1)
  }
  return 0
}
