const categoriesList = [
  { slug: '', name: 'ВСЕ АВТОЗАПЧАСТИ', sub: 'ПОЛНЫЙ КАТАЛОГ КОМПЛЕКТУЮЩИХ' },
  { slug: 'engine', name: 'Двигатель и выхлоп', sub: 'Поршневая группа и ГРМ' },
  { slug: 'brakes', name: 'Тормозная система', sub: 'Диски, колодки и суппорты' },
  { slug: 'suspension', name: 'Подвеска и рулевое', sub: 'Амортизаторы, рычаги и тяги' },
  { slug: 'electrics', name: 'Электрика и свет', sub: 'Зажигание, датчики и оптика' },
  { slug: 'filters', name: 'Фильтры и масла', sub: 'Масляные, воздушные и ТО' },
]

function NavigationDrawer({ isOpen, onClose, onSelectCategory }) {
  return (
    <>
      <div
        className={`app-menu-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
      />
      <aside
        className={`app-menu-drawer ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Меню навигации"
      >
        <div>
          <button
            type="button"
            className="app-menu-close-btn"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <span>✕</span> <span>ЗАКРЫТЬ</span>
          </button>
        </div>

        <div className="app-menu-title">
          <div className="t-top">
            <span className="fst-italic fw-light">Авто</span>{' '}
            <span className="text-uppercase">ЗАПЧАСТИ</span>
          </div>
          <div className="t-bottom">
            <span className="fst-italic fw-light">Магазин</span>{' '}
            <span className="text-uppercase">Veloce</span>
          </div>
        </div>

        <div className="app-menu-chapter-heading">КАТЕГОРИИ</div>

        <div className="d-flex flex-column gap-2">
          {categoriesList.map((cat, idx) => (
            <button
              key={cat.name}
              type="button"
              className="app-menu-item text-start border-0 bg-transparent p-0 w-100"
              onClick={() => {
                onSelectCategory(cat.name === 'ВСЕ АВТОЗАПЧАСТИ' ? '' : cat.name)
                onClose()
              }}
            >
              <div className="menu-gem-part">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {idx === 0 && (
                    <polygon
                      points="20,4 36,14 30,36 10,36 4,14"
                      fill="#5b6d82"
                      stroke="#5b6d82"
                      strokeWidth="1.2"
                    />
                  )}
                  {idx === 1 && (
                    <rect
                      x="12"
                      y="8"
                      width="16"
                      height="24"
                      rx="3"
                      fill="#146b42"
                      stroke="#146b42"
                      strokeWidth="1.2"
                    />
                  )}
                  {idx === 2 && (
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      fill="#a40b40"
                      stroke="#a40b40"
                      strokeWidth="1.2"
                    />
                  )}
                  {idx === 3 && (
                    <circle
                      cx="20"
                      cy="20"
                      r="14"
                      fill="#244b8a"
                      stroke="#244b8a"
                      strokeWidth="1.2"
                    />
                  )}
                  {idx === 4 && (
                    <path
                      d="M16 6h8v28h-8z"
                      fill="#d49b27"
                      stroke="#d49b27"
                      strokeWidth="1.2"
                    />
                  )}
                  {idx === 5 && (
                    <polygon
                      points="20,4 36,14 30,36 10,36 4,14"
                      fill="#5b6d82"
                      stroke="#5b6d82"
                      strokeWidth="1.2"
                    />
                  )}
                </svg>
              </div>
              <div>
                <span className="app-menu-item-title">{cat.name}</span>
                <span className="app-menu-item-sub">{cat.sub}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="app-menu-chapter-heading mt-4">АККАУНТ</div>
        <div className="p-3">
          <div className="font-sans-luxury text-muted mb-2 small">
            ВЫ ВОШЛИ КАК: <strong>buyer</strong>
          </div>
          <div className="small text-muted mb-3">
            В гараже сохранён автомобиль Toyota Camry 2018 для подбора деталей.
          </div>
        </div>
      </aside>
    </>
  )
}

export default NavigationDrawer
