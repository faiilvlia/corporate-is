import ProductCard from './ProductCard.jsx'

function ProductList({ products, cartItems, onAdd, onResetFilters }) {
  if (products.length === 0) {
    return (
      <div className="empty-results">
        <p className="empty">Ничего не найдено. Измените условия поиска.</p>
        {onResetFilters && (
          <button type="button" className="secondary" onClick={onResetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>
    )
  }

  return (
    <section className="product-list">
      {products.map((product) => {
        const item = cartItems.find((item) => item.productId === product.id)
        return (
          <ProductCard
            key={product.id}
            product={product}
            inCart={item ? item.quantity : 0}
            onAdd={onAdd}
          />
        )
      })}
    </section>
  )
}

export default ProductList
