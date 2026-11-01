import { useState } from 'react'
import { formatPrice } from '../utils/format.js'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  comment: '',
  agree: false,
}

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) {
    errors.name = 'Укажите имя'
  }
  if (form.phone.replace(/\D/g, '').length !== 11) {
    errors.phone = 'Номер телефона должен содержать 11 цифр'
  }
  if (form.email !== '' && !form.email.includes('@')) {
    errors.email = 'Некорректный адрес почты'
  }
  if (form.delivery === 'courier' && form.address.trim() === '') {
    errors.address = 'Укажите адрес доставки'
  }
  if (!form.agree) {
    errors.agree = 'Нужно согласие на обработку персональных данных'
  }
  return errors
}

function CheckoutForm({ total, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

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
    return submitted && errors[field] && <p className="error">{errors[field]}</p>
  }

  return (
    <form className="checkout" onSubmit={handleSubmit} noValidate>
      <h2>Оформление заказа</h2>
      <label>
        Имя *
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      {showError('name')}

      <label>
        Телефон *
        <input
          name="phone"
          type="tel"
          placeholder="+7 900 123-45-67"
          value={form.phone}
          onChange={handleChange}
        />
      </label>
      {showError('phone')}

      <label>
        Электронная почта
        <input name="email" type="email" value={form.email} onChange={handleChange} />
      </label>
      {showError('email')}

      <fieldset>
        <legend>Способ получения</legend>
        <label className="inline">
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={form.delivery === 'pickup'}
            onChange={handleChange}
          />
          Самовывоз
        </label>
        <label className="inline">
          <input
            type="radio"
            name="delivery"
            value="courier"
            checked={form.delivery === 'courier'}
            onChange={handleChange}
          />
          Курьер
        </label>
      </fieldset>

      {form.delivery === 'courier' && (
        <>
          <label>
            Адрес доставки *
            <input name="address" value={form.address} onChange={handleChange} />
          </label>
          {showError('address')}
        </>
      )}

      <label>
        Комментарий к заказу
        <textarea name="comment" rows={3} value={form.comment} onChange={handleChange} />
      </label>

      <label className="inline">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
        />
        Согласен на обработку персональных данных *
      </label>
      {showError('agree')}

      <p className="cart-total">К оплате: {formatPrice(total)}</p>

      <div className="cart-actions">
        <button type="submit" disabled={submitted && hasErrors}>
          Подтвердить заказ
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Назад
        </button>
      </div>
    </form>
  )
}

export default CheckoutForm
