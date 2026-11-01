const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export const FREE_DELIVERY_FROM = 10000

export function formatPrice(value) {
  return priceFormat.format(value)
}
