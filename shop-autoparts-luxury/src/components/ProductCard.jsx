import { formatPrice } from '../utils/format.js'

function ProductCard({ product, inCart, onAdd, isCompatible }) {
  const available = product.stock - inCart
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <article className="product-card h-100">
      {/* Изолированная верхняя планка над фото: артикул слева, бренд справа */}
      <div className="product-card-topbar">
        <span className="badge-sku">{product.sku}</span>
        <span className="product-brand-meta">{product.manufacturer}</span>
      </div>

      {/* Фрейм изображения */}
      <div className="product-card-media">
        <img
          src={product.image || '/img/no-image.svg'}
          alt={product.title}
          loading="lazy"
          className="img-fluid"
          style={{ maxHeight: '180px', objectFit: 'contain' }}
        />
        {isCompatible === true && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-success font-sans-luxury"
            style={{ fontSize: '0.65rem' }}
          >
            ✓ ПОДХОДИТ ДЛЯ ВАШЕГО АВТО
          </span>
        )}
        {isCompatible === false && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark font-sans-luxury"
            style={{ fontSize: '0.65rem' }}
          >
            ⚠ НЕ СОВМЕСТИМО С ГАРАЖОМ
          </span>
        )}
      </div>

      {/* Тело карточки */}
      <div className="p-3 p-xl-4 d-flex flex-column flex-grow-1">
        <h2 className="product-card-title">
          <span>{product.title}</span>
        </h2>

        {/* Рейтинг и отзывы */}
        <div className="mb-3 d-flex align-items-center gap-2">
          {product.rating ? (
            <span className="rating-badge">
              <span className="rating-star-gold">★</span> {product.rating}
              <span className="text-muted small ms-1">
                ({product.reviewsCount} отз.)
              </span>
            </span>
          ) : (
            <span className="text-muted label-caps">Без оценок</span>
          )}

          {discount && (
            <span className="badge bg-danger font-sans-luxury ms-auto">
              −{discount}%
            </span>
          )}
        </div>

        {/* Выровненный подвал карточки */}
        <div className="product-card-footer mt-auto">
          <div>
            <div className="price">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <s className="small text-muted d-block">
                {formatPrice(product.oldPrice)}
              </s>
            )}
            {product.stock > 0 ? (
              <div className="stock-indicator stock-indicator--in">
                ● В наличии ({available} шт.)
              </div>
            ) : (
              <div className="stock-indicator stock-indicator--out">
                ○ Нет в наличии
              </div>
            )}
          </div>

          {product.stock > 0 ? (
            <button
              className="btn-cartier-dark w-100"
              type="button"
              disabled={available === 0}
              onClick={() => onAdd(product.id)}
            >
              <i className="bi bi-bag-plus me-1" />
              <span>{available === 0 ? 'В КОРЗИНЕ' : 'В КОРЗИНУ'}</span>
            </button>
          ) : (
            <span
              className="btn-cartier w-100 disabled text-muted text-center"
              aria-disabled="true"
            >
              НЕТ В НАЛИЧИИ
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
