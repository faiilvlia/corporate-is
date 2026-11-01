import { formatPrice } from '../utils/format.js'

function ProductCard({ product, inCart, onAdd }) {
  const available = product.stock - inCart
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <article className="card">
      <span className="card-category">{product.category}</span>
      <h2>{product.title}</h2>
      <p className="card-price">
        {formatPrice(product.price)}
        {product.oldPrice && (
          <>
            <s className="card-old-price">{formatPrice(product.oldPrice)}</s>
            <span className="card-badge">−{discount}%</span>
          </>
        )}
      </p>
      {product.stock > 0 ? (
        <p className="card-stock">Осталось: {available} шт.</p>
      ) : (
        <p className="card-stock out">Нет в наличии</p>
      )}
      <button
        type="button"
        disabled={available === 0}
        onClick={() => onAdd(product.id)}
      >
        В корзину
      </button>
      {inCart > 0 && <p className="card-incart">В корзине: {inCart}</p>}
    </article>
  )
}

export default ProductCard
