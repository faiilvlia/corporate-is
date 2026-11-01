function Header({ shopName, productCount }) {
  return (
    <header className="header">
      <h1>{shopName}</h1>
      <p>Товаров в каталоге: {productCount}</p>
    </header>
  )
}

export default Header
