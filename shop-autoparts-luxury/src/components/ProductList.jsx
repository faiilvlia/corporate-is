import ProductCard from './ProductCard.jsx'

function ProductList({
  products,
  cartItems,
  onAdd,
  onResetFilters,
  selectedCar,
}) {
  if (products.length === 0) {
    return (
      <div className="card py-5 text-center my-4">
        <div className="card-body py-4">
          <div className="font-serif-luxury display-6 mb-2">
            Запчастей не найдено
          </div>
          <p className="text-muted small mb-4">
            По заданным параметрам автомобиля или поисковому запросу ничего не
            найдено.
          </p>
          {onResetFilters && (
            <button
              type="button"
              className="btn-cartier-dark"
              onClick={onResetFilters}
            >
              СБРОСИТЬ ВСЕ ФИЛЬТРЫ
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="row g-4">
      {products.map((product) => {
        const item = cartItems.find((i) => i.productId === product.id)
        let isCompatible = null
        if (selectedCar) {
          isCompatible = product.compat.includes(selectedCar.carKey)
        }

        return (
          <div key={product.id} className="col-12 col-md-6 col-xl-4">
            <ProductCard
              product={product}
              inCart={item ? item.quantity : 0}
              onAdd={onAdd}
              isCompatible={isCompatible}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ProductList
