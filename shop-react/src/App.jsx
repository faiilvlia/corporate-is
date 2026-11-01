import { useState, useReducer } from 'react'
import Header from './components/Header.jsx'
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
        title: line.product.title,
        price: line.product.price,
        quantity: typeof line.quantity === 'number' ? line.quantity : 1,
      })),
      discount,
      total: finalTotal,
    }
    console.log('Новый заказ:', order)

    // Задание 6: Списание остатков со склада при оформлении заказа
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
    <>
      <Header
        shopName="ТехноМаркет"
        productCount={catalog.length}
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
            Найдено {visibleProducts.length} из {catalog.length}
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
              {lastOrder.discount > 0 &&
                ` (Скидка: ${formatPrice(lastOrder.discount)})`}
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
