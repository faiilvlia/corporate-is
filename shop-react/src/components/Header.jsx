function Header({ shopName, productCount, inStockCount }) {
  return (
    <header className="header">
      <h1>{shopName}</h1>
      <p>
        Товаров в каталоге: {productCount}
        {inStockCount !== undefined && ` (в наличии: ${inStockCount})`}
      </p>
    </header>
  )
}

export default Header
