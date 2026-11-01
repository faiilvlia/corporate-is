function Filters({ filters, categories, onChange, onReset }) {
  return (
    <section className="filters-card">
      <div className="filters-header">
        <span className="filters-title">ГЛАВА II • СЕЛЕКЦИЯ КОМПОНЕНТОВ</span>
      </div>

      <div className="filters-grid">
        <div className="filter-item filter-search">
          <label htmlFor="search-input">Поиск по наименованию / бренду</label>
          <input
            id="search-input"
            type="search"
            placeholder="Brembo, Bosch, Mann-Filter, Denso..."
            value={filters.query}
            onChange={(e) => onChange('query', e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label htmlFor="category-select">Категория узла</label>
          <select
            id="category-select"
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
          >
            <option value="">Все узлы автомобиля</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="sort-select">Сортировка цен</label>
          <select
            id="sort-select"
            value={filters.sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            <option value="default">Базовый порядок</option>
            <option value="price-asc">По возрастанию цены</option>
            <option value="price-desc">По убыванию цены</option>
            <option value="title">По названию детали (А–Я)</option>
          </select>
        </div>

        <div className="filter-item filter-checkbox-wrap">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.onlyInStock}
              onChange={(e) => onChange('onlyInStock', e.target.checked)}
            />
            <span>Только в наличии</span>
          </label>
        </div>

        <div className="filter-item filter-btn-wrap">
          <button type="button" className="btn-reset" onClick={onReset}>
            Сбросить
          </button>
        </div>
      </div>
    </section>
  )
}

export default Filters
