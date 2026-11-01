import { formatPrice } from '../utils/format.js'

function Cart({
  lines,
  total,
  onChangeQuantity,
  onSetQuantity,
  onRemove,
  onClear,
  onCheckout,
}) {
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
        {lines.map((line) => {
          const qty = typeof line.quantity === 'number' ? line.quantity : 0
          return (
            <li key={line.productId} className="cart-line">
              <span className="cart-title">{line.product.title}</span>
              <div className="cart-controls">
                <button
                  type="button"
                  onClick={() => onChangeQuantity(line.productId, -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  className="cart-qty-input"
                  min={1}
                  max={line.product.stock}
                  value={line.quantity}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                      onSetQuantity(line.productId, '')
                    } else {
                      const parsed = parseInt(val, 10)
                      if (!isNaN(parsed)) {
                        onSetQuantity(line.productId, parsed)
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value, 10)
                    if (isNaN(val) || val < 1) {
                      onSetQuantity(line.productId, 1)
                    } else {
                      onSetQuantity(line.productId, Math.min(val, line.product.stock))
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={qty >= line.product.stock}
                  onClick={() => onChangeQuantity(line.productId, 1)}
                >
                  +
                </button>
                <span className="cart-sum">
                  {formatPrice(line.product.price * qty)}
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
          )
        })}
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
