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
    errors.address = 'Укажите адрес доставки автозапчастей'
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
    errors.agree = 'Необходимо подтвердить согласие на обработку данных'
  }
  return errors
}

function CheckoutForm({ total, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

  const discount = calculateDiscount(total, form.promoCode)
  const finalTotal = total - discount

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) {
      return
    }
    onSubmit(form)
  }

  function showError(field) {
    return submitted && errors[field] && (
      <p className="field-error">{errors[field]}</p>
    )
  }

  return (
    <form className="checkout-card" onSubmit={handleSubmit} noValidate>
      <div className="checkout-header">
        <h2 className="panel-title">Оформление заказа</h2>
        <span className="checkout-sub">Экспресс-доставка оригинальных деталей</span>
      </div>

      <div className="form-group">
        <label>Имя получателя / Заказчик *</label>
        <input
          name="name"
          placeholder="Иван Петров"
          value={form.name}
          onChange={handleChange}
        />
        {showError('name')}
      </div>

      <div className="form-group">
        <label>Номер телефона *</label>
        <input
          name="phone"
          type="tel"
          placeholder="+7 (900) 123-45-67"
          value={form.phone}
          onChange={handleChange}
        />
        {showError('phone')}
      </div>

      <div className="form-group">
        <label>Электронная почта (для квитанции)</label>
        <input
          name="email"
          type="email"
          placeholder="buyer@autoparts.ru"
          value={form.email}
          onChange={handleChange}
        />
        {showError('email')}
      </div>

      <fieldset className="delivery-fieldset">
        <legend>Способ получения заказа</legend>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="delivery"
              value="pickup"
              checked={form.delivery === 'pickup'}
              onChange={handleChange}
            />
            <span>Самовывоз со склада (бесплатно)</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="delivery"
              value="courier"
              checked={form.delivery === 'courier'}
              onChange={handleChange}
            />
            <span>Курьерская доставка</span>
          </label>
        </div>
      </fieldset>

      {form.delivery === 'courier' && (
        <div className="form-group">
          <label>Адрес доставки (город, улица, дом) *</label>
          <input
            name="address"
            placeholder="г. Новосибирск, ул. Ленина, д. 10"
            value={form.address}
            onChange={handleChange}
          />
          {showError('address')}
        </div>
      )}

      <div className="form-group">
        <label>Комментарий / Модель авто (VIN-код при наличии)</label>
        <textarea
          name="comment"
          rows={2}
          placeholder="Например: Toyota Camry 2018 г.в., проверка совместимости"
          value={form.comment}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Промокод на скидку</label>
        <input
          name="promoCode"
          placeholder="STUDENT10 или AUTOPARTS10"
          value={form.promoCode}
          onChange={handleChange}
        />
        {showError('promoCode')}
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          <span>Согласен на обработку персональных данных *</span>
        </label>
        {showError('agree')}
      </div>

      <div className="checkout-total-box">
        {discount > 0 && (
          <div className="summary-discount-row">
            <span>Скидка по промокоду (10%):</span>
            <span className="discount-val">−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="summary-total-row">
          <span>К оплате:</span>
          <span className="total-val">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      <div className="cart-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={submitted && hasErrors}
        >
          Подтвердить заказ
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Вернуться в корзину
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm
