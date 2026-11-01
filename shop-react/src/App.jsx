import Header from './components/Header.jsx'
import ProductList from './components/ProductList.jsx'
import Footer from './components/Footer.jsx'
import { products } from './data/products.js'
import './App.css'

const currentYear = new Date().getFullYear()

function App() {
  return (
    <>
      <Header shopName="ТехноМаркет" productCount={products.length} />
      <main>
        <ProductList products={products} />
      </main>
      <Footer shopName="ТехноМаркет" year={currentYear} />
    </>
  )
}

export default App
