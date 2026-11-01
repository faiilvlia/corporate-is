import { useState, useReducer, useEffect } from 'react'
import CursorFollower from './components/CursorFollower.jsx'
import Header from './components/Header.jsx'
import NavigationDrawer from './components/NavigationDrawer.jsx'
import AddCarModal from './components/AddCarModal.jsx'
import HeroLanding from './components/HeroLanding.jsx'
import SidebarFilters from './components/SidebarFilters.jsx'
import ProductList from './components/ProductList.jsx'
import CartPage from './components/CartPage.jsx'
import CheckoutPage from './components/CheckoutPage.jsx'
import Footer from './components/Footer.jsx'
import { initialProducts } from './data/autopartsData.js'
import { cartReducer } from './utils/cartReducer.js'
import { formatPrice } from './utils/format.js'
import './shop.css'
import './App.css'

const initialGarageCars = [
  {
    id: 'toyota_camry_2018_default',
    brand: 'Toyota',
    model: 'Camry',
    year: 2018,
    carKey: 'Toyota_Camry',
  },
]

const initialFiltersState = {
  query: '',
  category: '',
  brand: '',
  model: '',
  year: '',
  manufacturer: '',
  onlyInStock: false,
  sort: 'default',
}

function App() {
  const [catalog, setCatalog] = useState(initialProducts)
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [currentView, setCurrentView] = useState('catalog') // 'catalog' | 'cart' | 'checkout'
  const [filters, setFilters] = useState(initialFiltersState)
  const [garageCars, setGarageCars] = useState(initialGarageCars)
  const [selectedCar, setSelectedCar] = useState(initialGarageCars[0])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false)
  const [lastOrderSuccess, setLastOrderSuccess] = useState(null)

  // Caustic ambient glow tracking
  useEffect(() => {
    function handlePointerMove(e) {
      const glow = document.getElementById('causticAmbientGlow')
      if (glow) {
        const x = (e.clientX / window.innerWidth) * 100
        const y = (e.clientY / window.innerHeight) * 100
        glow.style.setProperty('--glow-x', `${x}%`)
        glow.style.setProperty('--glow-y', `${y}%`)
      }
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  // Filtering products
  const filteredProducts = catalog.filter((product) => {
    const q = filters.query.trim().toLowerCase()
    if (q) {
      const matchTitle = product.title.toLowerCase().includes(q)
      const matchSku = product.sku.toLowerCase().includes(q)
      const matchMf = product.manufacturer.toLowerCase().includes(q)
      if (!matchTitle && !matchSku && !matchMf) return false
    }

    if (filters.category && product.category !== filters.category) {
      return false
    }

    if (filters.manufacturer && product.manufacturer !== filters.manufacturer) {
      return false
    }

    if (filters.onlyInStock && product.stock <= 0) {
      return false
    }

    if (filters.model && !product.compat.includes(filters.model)) {
      return false
    }

    if (selectedCar && !filters.model && !product.compat.includes(selectedCar.carKey)) {
      // If garage car is active and no explicit model is selected, highlight or filter
      // (in Lab 3, active garage car filters parts to only compatible)
    }

    return true
  })

  // Sorting products
  const sortedProducts = filteredProducts.toSorted((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price
    if (filters.sort === 'price-desc') return b.price - a.price
    if (filters.sort === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (filters.sort === 'title') return a.title.localeCompare(b.title, 'ru')
    return 0
  })

  // Cart calculations
  const cartLines = cartItems.map((item) => ({
    ...item,
    product: catalog.find((p) => p.id === item.productId),
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
    setFilters(initialFiltersState)
  }

  function handleSelectCategoryFromHero(category) {
    setFilters((prev) => ({ ...prev, category }))
    setCurrentView('catalog')
  }

  function addToCart(productId) {
    dispatch({ type: 'add', productId })
    setLastOrderSuccess(null)
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
  }

  function handleAddCar(newCar) {
    setGarageCars((prev) => [...prev, newCar])
    setSelectedCar(newCar)
  }

  function handleRemoveCar(carId) {
    setGarageCars((prev) => prev.filter((c) => c.id !== carId))
    if (selectedCar && selectedCar.id === carId) {
      setSelectedCar(null)
    }
  }

  function handlePlaceOrder(orderData) {
    const order = {
      number: Date.now() % 100000,
      customer: orderData,
      items: cartLines.map((l) => ({
        productId: l.productId,
        title: l.product ? l.product.title : '',
        sku: l.product ? l.product.sku : '',
        price: l.product ? l.product.price : 0,
        quantity: typeof l.quantity === 'number' ? l.quantity : 1,
      })),
      discount: orderData.discount || 0,
      total: orderData.finalTotal || cartTotal,
    }
    console.log('Новый заказ Veloce:', order)

    // Списание остатков
    setCatalog((prev) =>
      prev.map((product) => {
        const item = cartLines.find((l) => l.productId === product.id)
        if (item) {
          const qty = typeof item.quantity === 'number' ? item.quantity : 1
          return { ...product, stock: Math.max(0, product.stock - qty) }
        }
        return product
      }),
    )

    dispatch({ type: 'clear' })
    setLastOrderSuccess(order)
    setCurrentView('catalog')
  }

  const showHero =
    currentView === 'catalog' &&
    !filters.category &&
    !filters.query &&
    !filters.brand &&
    !filters.model &&
    !filters.manufacturer

  return (
    <div className="veloce-exact-app">
      {/* Caustic Ambient Glow */}
      <div className="caustic-ambient-glow" id="causticAmbientGlow" aria-hidden="true" />

      {/* Инерционный курсор */}
      <CursorFollower label="ВЫБЕРИТЕ УЗЕЛ" />

      {/* Боковое меню */}
      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectCategory={(category) => {
          updateFilter('category', category)
          setCurrentView('catalog')
        }}
      />

      {/* Модальное окно добавления авто в гараж */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onAddCar={handleAddCar}
      />

      {/* Плавающая шапка Veloce */}
      <Header
        cartCount={cartCount}
        garageCars={garageCars}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
        onRemoveCar={handleRemoveCar}
        onOpenAddCarModal={() => setIsAddCarModalOpen(true)}
        onToggleMenu={setIsMenuOpen}
        searchQuery={filters.query}
        onSearchChange={(q) => {
          updateFilter('query', q)
          if (currentView !== 'catalog') setCurrentView('catalog')
        }}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Полноэкранный интерактивный лендинг (только на главной) */}
      {showHero && <HeroLanding onSelectCategory={handleSelectCategoryFromHero} />}

      {/* Якорь каталога */}
      <div id="catalog-anchor" />

      {/* Основной контент */}
      <div className="container-xxl px-3 px-md-5 mb-5">
        {/* Сообщение об успешном заказе */}
        {lastOrderSuccess && (
          <div
            className="alert alert-success alert-dismissible fade show mt-4 border shadow-sm"
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill fs-5 text-success" />
              <div>
                <strong>Спасибо, {lastOrderSuccess.customer.name}!</strong> Заказ №
                {lastOrderSuccess.number} на сумму{' '}
                <strong>{formatPrice(lastOrderSuccess.total)}</strong> успешно оформлен.
                {lastOrderSuccess.discount > 0 &&
                  ` Скидка 10%: ${formatPrice(lastOrderSuccess.discount)}.`}
                <div className="small text-muted mt-1">
                  Детали списаны со склада, менеджер свяжется с вами по номеру{' '}
                  {lastOrderSuccess.customer.phone}.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setLastOrderSuccess(null)}
              aria-label="Закрыть"
            />
          </div>
        )}

        {/* ПРЕДСТАВЛЕНИЕ КАТАЛОГА */}
        {currentView === 'catalog' && (
          <div className="catalog-curtain">
            <div className="row g-4 pt-4">
              {/* Боковая колонка фильтров (3 колонки) */}
              <div className="col-lg-3">
                <SidebarFilters
                  filters={filters}
                  onChange={updateFilter}
                  onReset={resetFilters}
                />
              </div>

              {/* Основная витрина каталога (9 колонок) */}
              <div className="col-lg-9">
                {/* Чип выбранного автомобиля из гаража */}
                {selectedCar && (
                  <div className="d-flex align-items-center justify-content-between p-3 mb-3 bg-white border shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="badge bg-dark py-2 px-3 fw-normal font-sans-luxury"
                        style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                      >
                        ГАРАЖ: {selectedCar.brand} {selectedCar.model} ({selectedCar.year})
                      </span>
                      <span className="small text-muted">
                        Отображаются совместимые оригинальные запчасти
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                      onClick={() => setSelectedCar(null)}
                    >
                      Сбросить авто ✕
                    </button>
                  </div>
                )}

                {/* Верхняя строка управления каталогом */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 mb-3 border-bottom">
                  <div className="small font-sans-luxury text-muted">
                    НАЙДЕНО ДЕТАЛЕЙ: <strong>{sortedProducts.length}</strong> ИЗ{' '}
                    {catalog.length}
                    {filters.category && (
                      <span className="badge bg-secondary ms-2">
                        {filters.category}
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <label
                      htmlFor="topSortSelect"
                      className="small text-muted font-sans-luxury text-nowrap"
                    >
                      Сортировка:
                    </label>
                    <select
                      id="topSortSelect"
                      className="form-select form-select-sm"
                      style={{ width: 'auto' }}
                      value={filters.sort}
                      onChange={(e) => updateFilter('sort', e.target.value)}
                    >
                      <option value="default">По умолчанию</option>
                      <option value="price-asc">Сначала доступные</option>
                      <option value="price-desc">Сначала дорогие</option>
                      <option value="rating">По рейтингу</option>
                      <option value="title">По названию (А–Я)</option>
                    </select>
                  </div>
                </div>

                {/* Сетка карточек товаров */}
                <ProductList
                  products={sortedProducts}
                  cartItems={cartItems}
                  onAdd={addToCart}
                  onResetFilters={resetFilters}
                  selectedCar={selectedCar}
                />
              </div>
            </div>
          </div>
        )}

        {/* ПРЕДСТАВЛЕНИЕ КОРЗИНЫ */}
        {currentView === 'cart' && (
          <CartPage
            lines={cartLines}
            total={cartTotal}
            onChangeQuantity={changeQuantity}
            onSetQuantity={setQuantity}
            onRemove={removeFromCart}
            onClear={clearCart}
            onNavigate={setCurrentView}
            selectedCar={selectedCar}
          />
        )}

        {/* ПРЕДСТАВЛЕНИЕ ОФОРМЛЕНИЯ ЗАКАЗА */}
        {currentView === 'checkout' && (
          <CheckoutPage
            lines={cartLines}
            total={cartTotal}
            onNavigate={setCurrentView}
            onSubmitOrder={handlePlaceOrder}
            selectedCar={selectedCar}
          />
        )}
      </div>

      {/* Футер */}
      <Footer
        onNavigate={setCurrentView}
        onOpenAddCarModal={() => setIsAddCarModalOpen(true)}
      />
    </div>
  )
}

export default App
