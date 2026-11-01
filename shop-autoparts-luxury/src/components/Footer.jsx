const currentYear = new Date().getFullYear()

function Footer({ onNavigate, onOpenAddCarModal }) {
  return (
    <footer className="footer mt-5 pt-5 pb-4">
      <div className="container-xxl px-3 px-md-5">
        <div className="row gy-4">
          <div className="col-md-5">
            <div
              className="cartier-main-logo text-white mb-2"
              style={{ fontSize: '1.35rem' }}
            >
              Veloce
            </div>
            <div
              className="font-sans-luxury text-white-50 mb-3"
              style={{ fontSize: '0.75rem' }}
            >
              ОРИГИНАЛЬНЫЕ КОМПЛЕКТУЮЩИЕ
            </div>
            <p
              className="small text-white-50 mb-0"
              style={{ maxWidth: '380px', lineHeight: '1.7' }}
            >
              Интернет-магазин оригинальных автозапчастей и качественных
              аналогов. Точный подбор по автомобилю, гарантия 12 месяцев и
              быстрая доставка.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <div
              className="font-sans-luxury text-white mb-3"
              style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}
            >
              ПОКУПАТЕЛЯМ
            </div>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-white-50 text-decoration-none small"
                  onClick={() => onNavigate('catalog')}
                >
                  Каталог запчастей
                </button>
              </li>
              <li className="mb-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-white-50 text-decoration-none small"
                  onClick={onOpenAddCarModal}
                >
                  Мой гараж
                </button>
              </li>
              <li className="mb-2">
                <button
                  type="button"
                  className="btn btn-link p-0 text-white-50 text-decoration-none small"
                  onClick={() => onNavigate('cart')}
                >
                  Корзина
                </button>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <div
              className="font-sans-luxury text-white mb-3"
              style={{ fontSize: '0.75rem', letterSpacing: '0.12em' }}
            >
              КОНТАКТЫ
            </div>
            <div className="small text-white-50">
              <div className="mb-1 text-white">
                <i className="bi bi-telephone me-2" /> +7 (495) 000-11-22
              </div>
              <div className="mb-2">
                <i className="bi bi-envelope me-2" /> info@veloce-parts.ru
              </div>
              <div className="text-white-50">
                <i className="bi bi-clock me-2" /> Ежедневно: 09:00 — 21:00
              </div>
            </div>
            <div className="mt-3 pt-2 border-top border-secondary small text-white-50">
              <span className="badge bg-secondary me-2">DEMO MODE</span>
              <code className="text-white">buyer</code> /{' '}
              <code className="text-white">manager</code> /{' '}
              <code className="text-white">admin</code>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-top border-secondary small text-center text-white-50">
          © {currentYear} «Veloce». Все права защищены.
        </div>
      </div>
    </footer>
  )
}

export default Footer
