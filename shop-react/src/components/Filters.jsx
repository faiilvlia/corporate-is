function Filters({ filters, categories, onChange, onReset }) {
  return (
    <section className="filters">
      <input
        type="search"
        placeholder="Поиск по названию"
        value={filters.query}
        onChange={(e) => onChange('query', e.target.value)}
      />
      <select
        value={filters.category}
        onChange={(e) => onChange('category', e.target.value)}
      >
        <option value="">Все категории</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        value={filters.sort}
        onChange={(e) => onChange('sort', e.target.value)}
      >
        <option value="default">Без сортировки</option>
        <option value="price-asc">Сначала дешёвые</option>
        <option value="price-desc">Сначала дорогие</option>
        <option value="title">По названию</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={filters.onlyInStock}
          onChange={(e) => onChange('onlyInStock', e.target.checked)}
        />
        Только в наличии
      </label>
      <button type="button" className="secondary" onClick={onReset}>
        Сбросить
      </button>
    </section>
  )
}

export default Filters
