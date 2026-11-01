export function filterProducts(products, filters) {
  const query = filters.query.trim().toLowerCase()
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(query) &&
      (filters.category === '' || product.category === filters.category) &&
      (!filters.onlyInStock || product.stock > 0),
  )
}

export function sortProducts(products, sort) {
  if (sort === 'price-asc') {
    return products.toSorted((a, b) => a.price - b.price)
  }
  if (sort === 'price-desc') {
    return products.toSorted((a, b) => b.price - a.price)
  }
  if (sort === 'title') {
    return products.toSorted((a, b) => a.title.localeCompare(b.title, 'ru'))
  }
  return products
}
