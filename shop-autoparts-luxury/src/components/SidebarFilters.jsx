import { brands, manufacturers } from '../data/autopartsData.js'

function SidebarFilters({
  filters,
  onChange,
  onReset,
}) {
  const selectedBrandObj = brands.find((b) => b.id === filters.brand)
  const availableModels = selectedBrandObj ? selectedBrandObj.models : []

  return (
    <div className="d-flex flex-column gap-4">
      {/* 1. Карточка подбора по автомобилю */}
      <div className="card shadow-sm border">
        <div className="card-header bg-white py-3">
          <i className="bi bi-sliders me-1" /> ПОДБОР ПО АВТОМОБИЛЮ
        </div>
        <div className="card-body p-3">
          <div className="mb-3">
            <label htmlFor="sidebarBrandSelect" className="form-label label-caps">
              Марка автомобиля
            </label>
            <select
              id="sidebarBrandSelect"
              className="form-select form-select-sm"
              value={filters.brand}
              onChange={(e) => {
                onChange('brand', e.target.value)
                onChange('model', '')
              }}
            >
              <option value="">Все марки</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="sidebarModelSelect" className="form-label label-caps">
              Модель
            </label>
            <select
              id="sidebarModelSelect"
              className="form-select form-select-sm"
              value={filters.model}
              onChange={(e) => onChange('model', e.target.value)}
              disabled={!filters.brand}
            >
              <option value="">
                {filters.brand ? 'Все модели марки' : 'Сначала выберите марку'}
              </option>
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.yearFrom}–{m.yearTo})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="sidebarYearInput" className="form-label label-caps">
              Год выпуска
            </label>
            <input
              type="number"
              id="sidebarYearInput"
              className="form-control form-control-sm"
              placeholder="Например: 2018"
              value={filters.year}
              onChange={(e) => onChange('year', e.target.value)}
            />
          </div>

          <div className="d-grid gap-2">
            {(filters.brand || filters.model || filters.year) && (
              <button
                type="button"
                className="btn-cartier btn-sm"
                onClick={onReset}
              >
                СБРОСИТЬ ПОДБОР
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Карточка производителей */}
      <div className="card shadow-sm border">
        <div className="card-header bg-white py-3">ПРОИЗВОДИТЕЛЬ</div>
        <div className="card-body p-3">
          <ul className="list-unstyled mb-0 small">
            <li className="mb-2">
              <button
                type="button"
                className={`font-sans-luxury border-0 bg-transparent text-start p-0 d-block py-1 ${
                  !filters.manufacturer ? 'text-dark fw-bold' : 'text-muted'
                }`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => onChange('manufacturer', '')}
              >
                {!filters.manufacturer ? '— ' : ''}ВСЕ БРЕНДЫ
              </button>
            </li>
            {manufacturers.map((mf) => (
              <li key={mf.id} className="mb-2">
                <button
                  type="button"
                  className={`border-0 bg-transparent text-start p-0 w-100 d-flex justify-content-between align-items-center py-1 ${
                    filters.manufacturer === mf.id
                      ? 'fw-bold text-dark'
                      : 'text-secondary'
                  }`}
                  onClick={() =>
                    onChange(
                      'manufacturer',
                      filters.manufacturer === mf.id ? '' : mf.id,
                    )
                  }
                >
                  <span>{mf.name}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {mf.country}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Чекбокс только в наличии */}
      <div className="card shadow-sm border">
        <div className="card-body p-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="inStockCheck"
              checked={filters.onlyInStock}
              onChange={(e) => onChange('onlyInStock', e.target.checked)}
            />
            <label
              className="form-check-label font-sans-luxury small"
              htmlFor="inStockCheck"
              style={{ fontSize: '0.8rem' }}
            >
              Только в наличии
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarFilters
