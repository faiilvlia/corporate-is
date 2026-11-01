import { useState, useReducer } from 'react'
import CursorFollower from './components/CursorFollower.jsx'
import Header from './components/Header.jsx'
import HeroLanding from './components/HeroLanding.jsx'
import Filters from './components/Filters.jsx'
import ProductList from './components/ProductList.jsx'
import Cart from './components/Cart.jsx'
import CheckoutForm from './components/CheckoutForm.jsx'
import Footer from './components/Footer.jsx'
import { products } from './data/products.js'
import { filterProducts, sortProducts } from './utils/catalog.js'
import { formatPrice, calculateDiscount } from './utils/format.js'
import { cartReducer } from './utils/cartReducer.js'
import './App.css'

const currentYear = new Date().getFullYear()

const initialFilters = {
  query: '',
  category: '',
  onlyInStock: false,
  sort: 'default',
}

const categories = [...new Set(products.map((product) => product.category))].toSorted()

function App() {
  const [catalog, setCatalog] = useState(products)
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [filters, setFilters] = useState(initialFilters)
  const [isCheckout, setIsCheckout] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const inStockCount = catalog.filter((product) => product.stock > 0).length
  const visibleProducts = sortProducts(filterProducts(catalog, filters), filters.sort)

  const cartLines = cartItems.map((item) => ({
    ...item,
    product: catalog.find((product) => product.id === item.productId),
  }))

  const cartCount = cartLines.reduce(
    (sum, line) => sum + (typeof line.quantity === 'number' ? line.quantity : 0),
    0,
  )
  const cartTotal = cartLines.reduce(
    (sum, line) =>
      sum +
      (line.product ? line.product.price : 0) *
        (typeof line.quantity === 'number' ? line.quantity : 0),
    0,
  )

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function resetFilters() {
    setFilters(initialFilters)
  }

  function handleSelectCategoryFromHero(category) {
    setFilters((prev) => ({ ...prev, category }))
  }

  function addToCart(productId) {
    dispatch({ type: 'add', productId })
    setLastOrder(null)
  }

  function changeQuantity(productId, delta) {
    dispatch({ type: 'changeQuantity', productId, delta })
  }

  function setQuantity(productId, quantity) {
    const product = catalog.find((p) => p.id === productId)
    dispatch({
      type: 'setQuantity',
      productId,
      quantity,
      maxStock: product ? product.stock : 1,
    })
  }

  function removeFromCart(productId) {
    dispatch({ type: 'remove', productId })
  }

  function clearCart() {
    dispatch({ type: 'clear' })
    setIsCheckout(false)
  }

  function placeOrder(customer) {
    const discount = calculateDiscount(cartTotal, customer.promoCode)
    const finalTotal = cartTotal - discount

    const order = {
      number: Date.now() % 100000,
      customer,
      items: cartLines.map((line) => ({
        productId: line.productId,
        title: line.product ? line.product.title : '',
        price: line.product ? line.product.price : 0,
        quantity: typeof line.quantity === 'number' ? line.quantity : 1,
      })),
      discount,
      total: finalTotal,
    }
    console.log('Новый заказ автозапчастей:', order)

    // Списание остатков
    setCatalog((prevCatalog) =>
      prevCatalog.map((product) => {
        const purchased = cartLines.find((line) => line.productId === product.id)
        if (purchased) {
          const qty =
            typeof purchased.quantity === 'number' ? purchased.quantity : 1
          return { ...product, stock: Math.max(0, product.stock - qty) }
        }
        return product
      }),
    )

    setLastOrder(order)
    dispatch({ type: 'clear' })
    setIsCheckout(false)
  }

  return (
    <div className="veloce-luxury-app">
      {/* Плавный инерционный курсор */}
      <CursorFollower label="ВЫБЕРИТЕ УЗЕЛ" />

      {/* Шапка */}
      <Header
        shopName="VELOCE"
        productCount={catalog.length}
        inStockCount={inStockCount}
        cartCount={cartCount}
        cartTotal={cartTotal}
      />

      {/* Полноэкранный интерактивный лендинг (Глава I) */}
      <HeroLanding onSelectCategory={handleSelectCategoryFromHero} />

      {/* Якорь каталога */}
      <div id="catalog-anchor" className="catalog-anchor-divider">
        <span className="chapter-tag">ГЛАВА II • КАТАЛОГ ОРИГИНАЛЬНЫХ ДЕТАЛЕЙ</span>
      </div>

      {/* Основная витрина и корзина (2 колонки) */}
      <main className="layout">
        <section className="catalog-column">
          <Filters
            filters={filters}
            categories={categories}
            onChange={updateFilter}
            onReset={resetFilters}
          />

          <div className="catalog-meta-bar">
            <span className="catalog-count">
              Отобрано: <strong>{visibleProducts.length}</strong> из {catalog.length} компонентов
            </span>
          </div>

          <ProductList
            products={visibleProducts}
            cartItems={cartItems}
            onAdd={addToCart}
            onResetFilters={resetFilters}
          />
        </section>

        <aside className="sidebar-column">
          {lastOrder && (
            <div className="order-success-card">
              <span className="success-badge">Заказ подтверждён</span>
              <p className="success-text">
                Благодарим вас, <strong>{lastOrder.customer.name}</strong>! Заказ №
                {lastOrder.number} на сумму <strong>{formatPrice(lastOrder.total)}</strong> успешно
                оформлен.
                {lastOrder.discount > 0 &&
                  ` Применена скидка 10%: ${formatPrice(lastOrder.discount)}.`}
              </p>
              <span className="success-note">
                Детали зарезервированы и списаны со склада. Менеджер свяжется с вами по номеру{' '}
                {lastOrder.customer.phone}.
              </span>
            </div>
          )}

          {isCheckout && cartLines.length > 0 ? (
            <CheckoutForm
              total={cartTotal}
              onSubmit={placeOrder}
              onCancel={() => setIsCheckout(false)}
            />
          ) : (
            <Cart
              lines={cartLines}
              total={cartTotal}
              onChangeQuantity={changeQuantity}
              onSetQuantity={setQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
              onCheckout={() => setIsCheckout(true)}
            />
          )}
        </aside>
      </main>

      {/* Подвал */}
      <Footer shopName="VELOCE" year={currentYear} />
    </div>
  )
}

export default App
