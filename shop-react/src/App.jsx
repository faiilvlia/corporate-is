import Header from './components/Header.jsx'
import ProductList from './components/ProductList.jsx'
import Footer from './components/Footer.jsx'
import { products } from './data/products.js'
import './App.css'

const currentYear = new Date().getFullYear()

function App() {
  const inStockCount = products.filter((product) => product.stock > 0).length
  const sortedProducts = products.toSorted((a, b) => a.price - b.price)

  return (
    <>
      <Header
        shopName="ТехноМаркет"
        productCount={products.length}
        inStockCount={inStockCount}
      />
      <main>
        <ProductList products={sortedProducts} />
      </main>
      <Footer shopName="ТехноМаркет" year={currentYear} />
    </>
  )
}

export default App
