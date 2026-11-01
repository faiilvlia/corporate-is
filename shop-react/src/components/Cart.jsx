import { formatPrice } from '../utils/format.js'

function Cart({ lines, total, onChangeQuantity, onRemove, onClear, onCheckout }) {
  if (lines.length === 0) {
    return (
      <section className="cart">
        <h2>Корзина</h2>
        <p className="empty">Корзина пуста</p>
      </section>
    )
  }

  return (
    <section className="cart">
      <h2>Корзина</h2>
      <ul className="cart-lines">
        {lines.map((line) => (
          <li key={line.productId} className="cart-line">
            <span className="cart-title">{line.product.title}</span>
            <div className="cart-controls">
              <button
                type="button"
                onClick={() => onChangeQuantity(line.productId, -1)}
              >
                −
              </button>
              <span>{line.quantity}</span>
              <button
                type="button"
                disabled={line.quantity >= line.product.stock}
                onClick={() => onChangeQuantity(line.productId, 1)}
              >
                +
              </button>
              <span className="cart-sum">
                {formatPrice(line.product.price * line.quantity)}
              </span>
              <button
                type="button"
                className="link"
                onClick={() => onRemove(line.productId)}
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="cart-total">Итого: {formatPrice(total)}</p>
      <div className="cart-actions">
        <button type="button" onClick={onCheckout}>
          Оформить заказ
        </button>
        <button type="button" className="secondary" onClick={onClear}>
          Очистить
        </button>
      </div>
    </section>
  )
}

export default Cart
