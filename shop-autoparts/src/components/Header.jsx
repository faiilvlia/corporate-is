import { formatPrice } from '../utils/format.js'

function Header({ shopName, productCount, inStockCount, cartCount, cartTotal }) {
  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-badge">ORIGINAL PARTS</span>
        <h1>{shopName}</h1>
        <p>
          Каталог деталей: <strong>{productCount}</strong>
          {inStockCount !== undefined && ` (в наличии: ${inStockCount})`}
        </p>
      </div>
      <div className="header-cart">
        {cartCount > 0 ? (
          <div className="header-cart-content">
            <span className="header-cart-label">Корзина заказов</span>
            <span className="header-cart-value">
              {cartCount} поз. • {formatPrice(cartTotal)}
            </span>
          </div>
        ) : (
          <span className="header-cart-empty">Корзина пуста</span>
        )}
      </div>
    </header>
  )
}

export default Header
