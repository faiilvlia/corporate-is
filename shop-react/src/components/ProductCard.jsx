import { useState } from 'react'

const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

function ProductCard({ product }) {
  const [inCart, setInCart] = useState(0)
  const available = product.stock - inCart

  return (
    <article className="card">
      <span className="card-category">{product.category}</span>
      <h2>{product.title}</h2>
      <p className="card-price">{priceFormat.format(product.price)}</p>
      {product.stock > 0 ? (
        <p className="card-stock">Осталось: {available} шт.</p>
      ) : (
        <p className="card-stock out">Нет в наличии</p>
      )}
      <button
        type="button"
        disabled={available === 0}
        onClick={() => setInCart(inCart + 1)}
      >
        В корзину
      </button>
      {inCart > 0 && <p className="card-incart">В корзине: {inCart}</p>}
    </article>
  )
}

export default ProductCard
