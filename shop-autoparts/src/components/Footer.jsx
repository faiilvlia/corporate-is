function Footer({ shopName, year }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {year} {shopName} — Премиальный подбор оригинальных деталей и комплектующих.
        </p>
        <p className="footer-note">
          Лабораторный проект курса «Корпоративные информационные системы» • Вариант 1 (Автозапчасти)
        </p>
      </div>
    </footer>
  )
}

export default Footer
