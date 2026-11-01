import ProductCard from './ProductCard.jsx'

function ProductList({ products, cartItems, onAdd }) {
  if (products.length === 0) {
    return <p className="empty">Ничего не найдено. Измените условия поиска.</p>
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
