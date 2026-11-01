import { formatPrice, FREE_DELIVERY_FROM } from '../utils/format.js'

function CartPage({
  lines,
  total,
  onChangeQuantity,
  onSetQuantity,
  onRemove,
  onClear,
  onNavigate,
  selectedCar,
}) {
  const incompatibleParts = selectedCar
    ? lines
        .map((l) => l.product)
        .filter((p) => p && !p.compat.includes(selectedCar.carKey))
    : []

  const remainingForFree = FREE_DELIVERY_FROM - total

  if (lines.length === 0) {
    return (
      <div className="pt-4">
        <div className="card py-5 text-center my-4 border">
          <div className="card-body py-4">
            <div className="font-serif-luxury display-6 mb-2">
              Ваша корзина пуста
            </div>
            <p className="text-muted small mb-4">
              Перейдите в каталог запчастей, чтобы подобрать комплектующие для
              вашего автомобиля.
            </p>
            <button
              type="button"
              className="btn-cartier-dark"
              onClick={() => onNavigate('catalog')}
            >
              ПЕРЕЙТИ В КАТАЛОГ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-4">
      {/* Заголовок страницы */}
      <div className="mb-4 border-bottom pb-3 d-flex justify-content-between align-items-end">
        <div>
          <div
            className="font-sans-luxury text-muted mb-1"
            style={{ fontSize: '0.75rem' }}
          >
            ВАША КОРЗИНА
          </div>
          <h1 className="font-serif-luxury display-6 mb-0">Корзина покупателя</h1>
        </div>
        <button
          type="button"
          className="btn btn-link p-0 font-sans-luxury text-muted text-decoration-none"
          style={{ fontSize: '0.75rem' }}
          onClick={() => onNavigate('catalog')}
        >
          ← ВЕРНУТЬСЯ В КАТАЛОГ
        </button>
      </div>

      {/* Предупреждение о несовместимости с автомобилем в гараже */}
      {incompatibleParts.length > 0 && (
        <div className="alert alert-warning d-flex align-items-start gap-3 p-4 mb-4 border">
          <i
            className="bi bi-exclamation-triangle fs-4"
            style={{ color: 'var(--color-warning)' }}
          />
          <div>
            <h6 className="font-sans-luxury mb-2">ПРОВЕРЬТЕ СОВМЕСТИМОСТЬ</h6>
            <p className="mb-2 small text-muted">
              Следующие позиции в вашей корзине{' '}
              <strong>
                не совместимы с выбранным автомобилем ({selectedCar.brand}{' '}
                {selectedCar.model})
              </strong>
              :
            </p>
            <ul className="mb-2 ps-3 small">
              {incompatibleParts.map((p) => (
                <li key={p.id}>
                  <strong>{p.title}</strong>{' '}
                  <span className="badge-sku ms-1">{p.sku}</span>
                </li>
              ))}
            </ul>
            <p className="mb-0 small text-muted">
              Пожалуйста, убедитесь, что вы заказываете подходящую деталь перед
              подтверждением заказа.
            </p>
          </div>
        </div>
      )}

      <div className="row g-4 mb-5">
        {/* Список позиций в корзине */}
        <div className="col-lg-8">
          <div className="card border">
            <div className="card-body p-0">
              {lines.map((line, idx) => {
                const qty =
                  typeof line.quantity === 'number' ? line.quantity : 0
                return (
                  <div
                    key={line.productId}
                    className={`cart-line p-3 p-md-4 ${
                      idx !== lines.length - 1 ? 'border-bottom' : ''
                    }`}
                  >
                    <div className="row g-3 align-items-center">
                      {/* Превью товара */}
                      <div className="col-3 col-sm-2">
                        <div className="cart-line-thumb text-center">
                          <img
                            src={line.product.image || '/img/no-image.svg'}
                            alt={line.product.title}
                            className="img-fluid"
                            style={{ maxHeight: '70px', objectFit: 'contain' }}
                          />
                        </div>
                      </div>

                      {/* Название, артикул и характеристики */}
                      <div className="col-9 col-sm-4">
                        <div className="font-serif-luxury fs-6 text-dark d-block mb-1 fw-bold">
                          {line.product.title}
                        </div>
                        <div className="text-muted small mb-1">
                          {line.product.category} • {line.product.manufacturer}
                        </div>
                        <span className="badge-sku">
                          АРТ: {line.product.sku}
                        </span>
                      </div>

                      {/* Степпер количества */}
                      <div className="col-6 col-sm-3">
                        <div className="qty-stepper d-inline-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm qty-btn"
                            onClick={() =>
                              onChangeQuantity(line.productId, -1)
                            }
                            aria-label="Уменьшить количество"
                          >
                            −
                          </button>
                          <input
                            className="form-control form-control-sm qty-input text-center mx-1"
                            type="number"
                            min="1"
                            max={line.product.stock}
                            value={line.quantity}
                            onChange={(e) => {
                              const val = e.target.value
                              if (val === '') {
                                onSetQuantity(line.productId, '')
                              } else {
                                const parsed = parseInt(val, 10)
                                if (!isNaN(parsed)) {
                                  onSetQuantity(line.productId, parsed)
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value, 10)
                              if (isNaN(val) || val < 1) {
                                onSetQuantity(line.productId, 1)
                              } else {
                                onSetQuantity(
                                  line.productId,
                                  Math.min(val, line.product.stock),
                                )
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm qty-btn"
                            disabled={qty >= line.product.stock}
                            onClick={() => onChangeQuantity(line.productId, 1)}
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>
                        <div
                          className="text-muted small mt-1 font-sans-luxury"
                          style={{ fontSize: '0.75rem' }}
                        >
                          {formatPrice(line.product.price)} / шт.
                        </div>
                      </div>

                      {/* Сумма и удаление */}
                      <div className="col-6 col-sm-3 text-end d-flex justify-content-end align-items-center gap-3">
                        <div className="font-serif-luxury fs-5 text-nowrap fw-semibold">
                          {formatPrice(line.product.price * qty)}
                        </div>
                        <button
                          className="btn btn-link text-muted p-1 border-0 bg-transparent"
                          type="button"
                          title="Удалить позицию"
                          onClick={() => onRemove(line.productId)}
                        >
                          <i className="bi bi-trash3 fs-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn-cartier btn-sm"
              onClick={() => onNavigate('catalog')}
            >
              ← ВЕРНУТЬСЯ В КАТАЛОГ
            </button>
            <button
              type="button"
              className="btn btn-link text-muted small text-decoration-none"
              onClick={onClear}
            >
              ОЧИСТИТЬ КОРЗИНУ
            </button>
          </div>
        </div>

        {/* Блок Итого к оплате */}
        <div className="col-lg-4">
          <div className="card p-4 position-sticky border shadow-sm" style={{ top: '100px' }}>
            <h5 className="font-sans-luxury mb-3 fs-6">ИТОГО К ОПЛАТЕ</h5>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Позиций в заказе:</span>
              <span>{lines.length}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Доставка:</span>
              <span className={remainingForFree <= 0 ? 'text-success fw-bold' : ''}>
                {remainingForFree <= 0 ? 'Бесплатно' : 'По тарифу курьера'}
              </span>
            </div>

            {remainingForFree > 0 && (
              <div
                className="p-2 mb-3 bg-light border small text-muted"
                style={{ fontSize: '0.75rem' }}
              >
                До бесплатной экспресс-доставки осталось{' '}
                <strong>{formatPrice(remainingForFree)}</strong>
              </div>
            )}

            <div className="border-top pt-3 mb-4 d-flex justify-content-between align-items-baseline">
              <span className="font-sans-luxury text-dark">СУММА:</span>
              <span className="font-serif-luxury fs-3 text-dark fw-bold">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="button"
              className="btn-cartier-dark w-100 text-center py-3 mb-3"
              onClick={() => onNavigate('checkout')}
            >
              ПЕРЕЙТИ К ОФОРМЛЕНИЮ →
            </button>

            <div
              className="small text-muted text-center"
              style={{ fontSize: '0.75rem', lineHeight: 1.6 }}
            >
              <i className="bi bi-shield-check text-success me-1" /> Гарантия 12
              месяцев на все детали. Возврат без проблем в течение 14 дней.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
