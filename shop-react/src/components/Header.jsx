import { formatPrice } from '../utils/format.js'

function Header({ shopName, productCount, inStockCount, cartCount, cartTotal }) {
  return (
    <header className="header">
      <div>
        <h1>{shopName}</h1>
        <p>
          Товаров в каталоге: {productCount}
          {inStockCount !== undefined && ` (в наличии: ${inStockCount})`}
        </p>
      </div>
      <div className="header-cart">
        {cartCount > 0
          ? `Корзина: ${cartCount} шт. на ${formatPrice(cartTotal)}`
          : 'Корзина пуста'}
      </div>
    </header>
  )
}

export default Header
