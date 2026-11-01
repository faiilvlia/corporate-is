import { useState } from 'react'
import Header from './components/Header.jsx'
import Filters from './components/Filters.jsx'
import ProductList from './components/ProductList.jsx'
import Cart from './components/Cart.jsx'
import CheckoutForm from './components/CheckoutForm.jsx'
import Footer from './components/Footer.jsx'
import { products } from './data/products.js'
import { filterProducts, sortProducts } from './utils/catalog.js'
import { formatPrice, calculateDiscount } from './utils/format.js'
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
  const [cartItems, setCartItems] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [isCheckout, setIsCheckout] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)

  const inStockCount = products.filter((product) => product.stock > 0).length
  const visibleProducts = sortProducts(filterProducts(products, filters), filters.sort)

  const cartLines = cartItems.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId),
  }))

  const cartCount = cartLines.reduce(
    (sum, line) => sum + (typeof line.quantity === 'number' ? line.quantity : 0),
    0,
  )
  const cartTotal = cartLines.reduce(
    (sum, line) =>
      sum +
      line.product.price *
        (typeof line.quantity === 'number' ? line.quantity : 0),
    0,
  )

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function resetFilters() {
    setFilters(initialFilters)
  }

  function addToCart(productId) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        const currentQty =
          typeof existing.quantity === 'number' ? existing.quantity : 1
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: currentQty + 1 }
            : item,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
    setLastOrder(null)
  }

  function changeQuantity(productId, delta) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item
          const currentQty =
            typeof item.quantity === 'number' ? item.quantity : 1
          return { ...item, quantity: currentQty + delta }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  function setQuantity(productId, quantity) {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item
        if (quantity === '') {
          return { ...item, quantity: '' }
        }
        const product = products.find((p) => p.id === productId)
        const maxStock = product ? product.stock : 1
        const clamped = Math.max(1, Math.min(quantity, maxStock))
        return { ...item, quantity: clamped }
      }),
    )
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setCartItems([])
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
        title: line.product.title,
        price: line.product.price,
        quantity: typeof line.quantity === 'number' ? line.quantity : 1,
      })),
      discount,
      total: finalTotal,
    }
    console.log('Новый заказ:', order)
    setLastOrder(order)
    setCartItems([])
    setIsCheckout(false)
  }

  return (
    <>
      <Header
        shopName="ТехноМаркет"
        productCount={products.length}
        inStockCount={inStockCount}
        cartCount={cartCount}
        cartTotal={cartTotal}
      />
      <main className="layout">
        <div>
          <Filters
            filters={filters}
            categories={categories}
            onChange={updateFilter}
            onReset={resetFilters}
          />
          <p className="catalog-count">
            Найдено {visibleProducts.length} из {products.length}
          </p>
          <ProductList
            products={visibleProducts}
            cartItems={cartItems}
            onAdd={addToCart}
            onResetFilters={resetFilters}
          />
        </div>
        <aside>
          {lastOrder && (
            <p className="success">
              Спасибо, {lastOrder.customer.name}! Заказ №{lastOrder.number} на{' '}
              {formatPrice(lastOrder.total)} оформлен.
              {lastOrder.discount > 0 && ` (Скидка: ${formatPrice(lastOrder.discount)})`}
            </p>
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
      <Footer shopName="ТехноМаркет" year={currentYear} />
    </>
  )
}

export default App
