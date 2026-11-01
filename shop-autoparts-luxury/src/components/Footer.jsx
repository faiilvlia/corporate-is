function Footer({ shopName, year }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">{shopName}</span>
          <span className="footer-sub">VELOCE AUTOMOTIVE LUXURY</span>
        </div>
        <p className="footer-copyright">
          © {year} {shopName} — Экспозиция и дистрибуция оригинальных компонентов мировых производителей.
        </p>
        <p className="footer-note">
          Лабораторная работа №0.4 – №0.5 • Вариант 3 (Полноэкранный интерактивный лендинг с витриной и корзиной)
        </p>
      </div>
    </footer>
  )
}

export default Footer
