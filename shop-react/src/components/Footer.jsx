function Footer({ shopName, year }) {
  return (
    <footer className="footer">
      <p>© {year} {shopName}</p>
    </footer>
  )
}

export default Footer
