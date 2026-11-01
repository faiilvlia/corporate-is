import { formatPrice, FREE_DELIVERY_FROM } from '../utils/format.js'

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
      <section className="cart-card">
        <h2 className="panel-title">Корзина деталей</h2>
        <div className="cart-empty-box">
          <p className="empty">В корзине пока нет выбранных позиций</p>
          <span className="empty-hint">Выберите нужные детали в каталоге</span>
        </div>
      </section>
    )
  }

  const remainingForFree = FREE_DELIVERY_FROM - total

  return (
    <section className="cart-card">
      <div className="cart-header">
        <h2 className="panel-title">Корзина деталей</h2>
        <span className="cart-count-badge">{lines.length} поз.</span>
      </div>

      <ul className="cart-lines">
        {lines.map((line) => {
          const qty = typeof line.quantity === 'number' ? line.quantity : 0
          return (
            <li key={line.productId} className="cart-line">
              <div className="cart-line-info">
                <span className="cart-line-title">{line.product.title}</span>
                <span className="cart-line-cat">{line.product.category}</span>
              </div>

              <div className="cart-controls">
                <div className="qty-picker">
                  <button
                    type="button"
                    className="qty-btn"
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
                        onSetQuantity(
                          line.productId,
                          Math.min(val, line.product.stock),
                        )
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    disabled={qty >= line.product.stock}
                    onClick={() => onChangeQuantity(line.productId, 1)}
                  >
                    +
                  </button>
                </div>

                <span className="cart-sum">
                  {formatPrice(line.product.price * qty)}
                </span>

                <button
                  type="button"
                  className="btn-remove"
                  title="Удалить позицию"
                  onClick={() => onRemove(line.productId)}
                >
                  ✕
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Сумма позиций:</span>
          <span className="summary-val">{formatPrice(total)}</span>
        </div>

        <div className={`delivery-bar ${remainingForFree <= 0 ? 'free' : ''}`}>
          {remainingForFree <= 0 ? (
            <span>✓ Включена премиальная экспресс-доставка</span>
          ) : (
            <span>
              До бесплатной доставки: <strong>{formatPrice(remainingForFree)}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="cart-actions">
        <button type="button" className="btn-primary" onClick={onCheckout}>
          Оформить заказ
        </button>
        <button type="button" className="btn-secondary" onClick={onClear}>
          Очистить корзину
        </button>
      </div>
    </section>
  )
}

export default Cart
