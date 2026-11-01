import { formatPrice } from '../utils/format.js'

function ProductCard({ product, inCart, onAdd }) {
  const available = product.stock - inCart
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <article className="card">
      <div className="card-top">
        <span className="card-category">{product.category}</span>
        {product.stock > 0 ? (
          <span className="card-stock">В наличии: {available} шт.</span>
        ) : (
          <span className="card-stock out">Под заказ / Нет на складе</span>
        )}
      </div>

      <h2 className="card-title">{product.title}</h2>

      <div className="card-price-row">
        <span className="card-price">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="card-old-wrap">
            <s className="card-old-price">{formatPrice(product.oldPrice)}</s>
            <span className="card-badge">−{discount}%</span>
          </span>
        )}
      </div>

      <div className="card-action-row">
        <button
          type="button"
          className="btn-add"
          disabled={available === 0}
          onClick={() => onAdd(product.id)}
        >
          {available === 0 ? 'Нет на складе' : 'В корзину'}
        </button>
        {inCart > 0 && <span className="card-incart">В корзине: {inCart}</span>}
      </div>
    </article>
  )
}

export default ProductCard
