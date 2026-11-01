import Header from './components/Header.jsx'
import ProductList from './components/ProductList.jsx'
import { products } from './data/products.js'
import './App.css'

function App() {
  return (
    <>
      <Header shopName="ТехноМаркет" productCount={products.length} />
      <main>
        <ProductList products={products} />
      </main>
    </>
  )
}

export default App
