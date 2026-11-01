import { useState } from 'react'
import Header from './components/Header.jsx'
import ProductList from './components/ProductList.jsx'
import Cart from './components/Cart.jsx'
import Footer from './components/Footer.jsx'
import { products } from './data/products.js'
import './App.css'

const currentYear = new Date().getFullYear()

function App() {
  const [cartItems, setCartItems] = useState([])

  const inStockCount = products.filter((product) => product.stock > 0).length

  const cartLines = cartItems.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId),
  }))

  const cartCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)
  const cartTotal = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  )

  function addToCart(productId) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  function changeQuantity(productId, delta) {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setCartItems([])
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
          <ProductList products={products} cartItems={cartItems} onAdd={addToCart} />
        </div>
        <aside>
          <Cart
            lines={cartLines}
            total={cartTotal}
            onChangeQuantity={changeQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            onCheckout={() => console.log('Оформление заказа сделаем в части 7')}
          />
        </aside>
      </main>
      <Footer shopName="ТехноМаркет" year={currentYear} />
    </>
  )
}

export default App
