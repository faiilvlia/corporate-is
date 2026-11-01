import { useState } from 'react'
import { formatPrice, calculateDiscount } from '../utils/format.js'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  comment: '',
  promoCode: '',
  agree: false,
}

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) {
    errors.name = 'Укажите контактное лицо (не менее 2 символов)'
  }
  if (form.phone.replace(/\D/g, '').length !== 11) {
    errors.phone = 'Телефон должен содержать 11 цифр (+7 900 123-45-67)'
  }
  if (form.email !== '' && !form.email.includes('@')) {
    errors.email = 'Укажите корректный email для отправки чека'
  }
  if (form.delivery === 'courier' && form.address.trim() === '') {
    errors.address = 'Укажите точный адрес курьерской доставки'
  }
  const cleanPromo = form.promoCode.trim().toUpperCase()
  if (
    cleanPromo !== '' &&
    cleanPromo !== 'STUDENT10' &&
    cleanPromo !== 'AUTOPARTS10'
  ) {
    errors.promoCode = 'Неверный промокод (доступны: STUDENT10, AUTOPARTS10)'
  }
  if (!form.agree) {
    errors.agree = 'Необходимо подтвердить согласие на обработку персональных данных'
  }
  return errors
}

function CheckoutPage({ lines, total, onNavigate, onSubmitOrder, selectedCar }) {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

  const discount = calculateDiscount(total, form.promoCode)
  const finalTotal = total - discount

  const incompatibleParts = selectedCar
    ? lines
        .map((l) => l.product)
        .filter((p) => p && !p.compat.includes(selectedCar.carKey))
    : []

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) return

    onSubmitOrder({
      ...form,
      discount,
      finalTotal,
    })
  }

  return (
    <div className="pt-4 mb-5">
      <div className="mb-4 border-bottom pb-3">
        <div
          className="font-sans-luxury text-muted mb-1"
          style={{ fontSize: '0.75rem' }}
        >
          ПОДТВЕРЖДЕНИЕ ЗАКАЗА
        </div>
        <h1 className="font-serif-luxury display-6 mb-0">Оформление доставки</h1>
      </div>

      {incompatibleParts.length > 0 && (
        <div className="alert alert-warning d-flex align-items-start gap-3 p-4 mb-4 border">
          <i
            className="bi bi-exclamation-triangle fs-4"
            style={{ color: 'var(--color-warning)' }}
          />
          <div>
            <h6 className="font-sans-luxury mb-1">ПРОВЕРЬТЕ СОВМЕСТИМОСТЬ</h6>
            <p className="mb-0 small text-muted">
              Внимание: следующие запчасти не совместимы с выбранной машиной из
              вашего гаража:
              <strong className="text-dark ms-1">
                {incompatibleParts.map((p) => p.title).join(', ')}
              </strong>
              . Вы можете продолжить оформление, если приобретаете деталь для
              другого автомобиля.
            </p>
          </div>
        </div>
      )}

      <div className="row g-5">
        <div className="col-lg-7">
          <div className="card border">
            <div className="card-header bg-white py-3">
              ДАННЫЕ ПОЛУЧАТЕЛЯ И АДРЕС ДОСТАВКИ
            </div>
            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label label-caps">Имя заказчика *</label>
                  <input
                    name="name"
                    className="form-control form-control-sm"
                    placeholder="Иван Петров"
                    value={form.name}
                    onChange={handleChange}
                  />
                  {submitted && errors.name && (
                    <div className="text-danger small mt-1">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label label-caps">Номер телефона *</label>
                  <input
                    name="phone"
                    type="tel"
                    className="form-control form-control-sm"
                    placeholder="+7 913 111-22-33"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  {submitted && errors.phone && (
                    <div className="text-danger small mt-1">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label label-caps">
                    Электронная почта
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="form-control form-control-sm"
                    placeholder="buyer@autoparts.ru"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {submitted && errors.email && (
                    <div className="text-danger small mt-1">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label label-caps">Способ доставки</label>
                  <div className="d-flex gap-4 mt-1">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="delivery"
                        id="delPickup"
                        value="pickup"
                        checked={form.delivery === 'pickup'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small" htmlFor="delPickup">
                        Самовывоз со склада (бесплатно)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="delivery"
                        id="delCourier"
                        value="courier"
                        checked={form.delivery === 'courier'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small" htmlFor="delCourier">
                        Курьерская доставка
                      </label>
                    </div>
                  </div>
                </div>

                {form.delivery === 'courier' && (
                  <div className="mb-3">
                    <label className="form-label label-caps">
                      Адрес доставки *
                    </label>
                    <input
                      name="address"
                      className="form-control form-control-sm"
                      placeholder="г. Новосибирск, ул. Ленина, д. 10"
                      value={form.address}
                      onChange={handleChange}
                    />
                    {submitted && errors.address && (
                      <div className="text-danger small mt-1">
                        {errors.address}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label label-caps">
                    VIN-код авто или комментарий к заказу
                  </label>
                  <textarea
                    name="comment"
                    rows="2"
                    className="form-control form-control-sm"
                    placeholder="Например: Toyota Camry 2018 (VIN: JTNB11...)"
                    value={form.comment}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label label-caps">Промокод</label>
                  <input
                    name="promoCode"
                    className="form-control form-control-sm"
                    placeholder="STUDENT10 или AUTOPARTS10"
                    value={form.promoCode}
                    onChange={handleChange}
                  />
                  {submitted && errors.promoCode && (
                    <div className="text-danger small mt-1">
                      {errors.promoCode}
                    </div>
                  )}
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    name="agree"
                    className="form-check-input"
                    id="agreeCheck"
                    checked={form.agree}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label small text-muted"
                    htmlFor="agreeCheck"
                  >
                    Согласен на обработку персональных данных и условия
                    доставки *
                  </label>
                  {submitted && errors.agree && (
                    <div className="text-danger small mt-1">{errors.agree}</div>
                  )}
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-link p-0 font-sans-luxury text-muted text-decoration-none"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => onNavigate('cart')}
                  >
                    ← ВЕРНУТЬСЯ В КОРЗИНУ
                  </button>
                  <button
                    className="btn-cartier-dark px-5"
                    type="submit"
                    disabled={submitted && hasErrors}
                  >
                    ПОДТВЕРДИТЬ ЗАКАЗ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card sticky-top border shadow-sm" style={{ top: '100px' }}>
            <div className="card-header bg-white py-3">СОСТАВ ВАШЕГО ЗАКАЗА</div>
            <ul className="list-group list-group-flush">
              {lines.map((line) => {
                const qty =
                  typeof line.quantity === 'number' ? line.quantity : 1
                return (
                  <li
                    key={line.productId}
                    className="list-group-item d-flex justify-content-between align-items-center py-3 px-4"
                  >
                    <div>
                      <div className="font-serif-luxury fs-6">
                        {line.product.title}
                      </div>
                      <small className="text-muted">
                        <span className="badge-sku me-1">
                          {line.product.sku}
                        </span>{' '}
                        × {qty} шт.
                      </small>
                    </div>
                    <span className="text-nowrap font-serif-luxury fs-5 fw-semibold">
                      {formatPrice(line.product.price * qty)}
                    </span>
                  </li>
                )
              })}

              {discount > 0 && (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center py-2 px-4"
                  style={{ background: '#edf7ee' }}
                >
                  <span className="font-sans-luxury text-success small">
                    СКИДКА ПО ПРОМОКОДУ (10%):
                  </span>
                  <span className="font-serif-luxury text-success fw-bold">
                    −{formatPrice(discount)}
                  </span>
                </li>
              )}

              <li
                className="list-group-item d-flex justify-content-between align-items-center py-4 px-4"
                style={{ background: 'var(--color-alabaster)' }}
              >
                <span className="font-sans-luxury text-dark fw-bold">
                  ИТОГО К ОПЛАТЕ:
                </span>
                <span className="font-serif-luxury fs-3 text-nowrap text-dark fw-bold">
                  {formatPrice(finalTotal)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
