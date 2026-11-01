import { useState } from 'react'

function Header({
  cartCount,
  garageCars,
  selectedCar,
  onSelectCar,
  onRemoveCar,
  onOpenAddCarModal,
  onToggleMenu,
  searchQuery,
  onSearchChange,
  currentView,
  onNavigate,
}) {
  const [garageOpen, setGarageOpen] = useState(false)

  return (
    <header className="cartier-floating-header">
      <div className="cartier-header-inner">
        {/* Левая часть: кнопка меню + десктопный поиск */}
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="menu-trigger-btn"
            onClick={() => onToggleMenu(true)}
            aria-label="Меню навигации"
          >
            <span className="menu-trigger-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="menu-trigger-label d-none d-sm-inline">МЕНЮ</span>
          </button>

          {/* Постоянный десктопный поиск в шапке */}
          <div className="header-search d-none d-lg-flex" role="search">
            <i className="bi bi-search header-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="header-search-input"
              placeholder="Поиск по названию, артикулу или OEM..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Центр: Логотип бренда */}
        <button
          type="button"
          className="cartier-brand-center border-0 bg-transparent text-decoration-none"
          onClick={() => onNavigate('catalog')}
        >
          <span className="cartier-main-logo">Veloce</span>
          <span className="cartier-sub-logo">ОРИГИНАЛЬНЫЕ КОМПЛЕКТУЮЩИЕ</span>
        </button>

        {/* Правая часть: Гараж, Корзина, Профиль */}
        <div className="cartier-header-utilities">
          {/* Выпадающий список гаража */}
          <div className="dropdown position-relative">
            <button
              type="button"
              className="utility-link border-0 bg-transparent"
              onClick={() => setGarageOpen(!garageOpen)}
              title="Мой гараж"
            >
              <i className="bi bi-car-front" />
              <span className="d-none d-md-inline ms-1">
                {selectedCar
                  ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})`
                  : `ГАРАЖ (${garageCars.length})`}
              </span>
            </button>

            {garageOpen && (
              <div
                className="dropdown-menu dropdown-menu-end p-3 border shadow-sm show"
                style={{
                  minWidth: '300px',
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  zIndex: 1050,
                  background: '#ffffff',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <span
                    className="font-sans-luxury text-muted"
                    style={{ fontSize: '0.75rem' }}
                  >
                    МОЙ ГАРАЖ
                  </span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none font-sans-luxury text-dark"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      setGarageOpen(false)
                      onOpenAddCarModal()
                    }}
                  >
                    + ДОБАВИТЬ
                  </button>
                </div>

                {garageCars.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {garageCars.map((car) => {
                      const isSelected =
                        selectedCar && selectedCar.id === car.id
                      return (
                        <li
                          key={car.id}
                          className="d-flex justify-content-between align-items-center py-2 border-bottom"
                        >
                          <button
                            type="button"
                            className={`btn btn-link p-0 text-decoration-none text-start small ${
                              isSelected
                                ? 'fw-bold text-dark'
                                : 'text-secondary'
                            }`}
                            onClick={() => {
                              onSelectCar(isSelected ? null : car)
                              setGarageOpen(false)
                            }}
                          >
                            {isSelected ? '✓ ' : ''}
                            {car.brand} {car.model} ({car.year})
                          </button>
                          <button
                            type="button"
                            className="btn btn-link text-muted p-0 ms-2"
                            title="Удалить из гаража"
                            onClick={() => onRemoveCar(car.id)}
                          >
                            ✕
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <div className="small text-muted py-2">
                    В гараже пока нет автомобилей. Добавьте свой автомобиль для
                    проверки совместимости.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Корзина */}
          <button
            type="button"
            className={`utility-link border-0 bg-transparent ${
              currentView === 'cart' ? 'fw-bold' : ''
            }`}
            onClick={() => onNavigate('cart')}
            title="Корзина"
          >
            <i className="bi bi-bag" />
            <span className="d-none d-md-inline ms-1">КОРЗИНА</span>
            {cartCount > 0 && (
              <span className="cart-counter-dot ms-1">{cartCount}</span>
            )}
          </button>

          {/* Профиль пользователя */}
          <div className="utility-link d-none d-sm-inline-flex align-items-center">
            <i className="bi bi-person me-1" />
            <span className="small">buyer</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
