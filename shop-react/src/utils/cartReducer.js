export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((item) => item.productId === action.productId)
      if (existing) {
        const currentQty =
          typeof existing.quantity === 'number' ? existing.quantity : 1
        return state.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: currentQty + 1 }
            : item,
        )
      }
      return [...state, { productId: action.productId, quantity: 1 }]
    }

    case 'changeQuantity': {
      return state
        .map((item) => {
          if (item.productId !== action.productId) return item
          const currentQty =
            typeof item.quantity === 'number' ? item.quantity : 1
          return { ...item, quantity: currentQty + action.delta }
        })
        .filter((item) => item.quantity > 0)
    }

    case 'setQuantity': {
      return state.map((item) => {
        if (item.productId !== action.productId) return item
        if (action.quantity === '') {
          return { ...item, quantity: '' }
        }
        const maxStock = action.maxStock ?? 1
        const clamped = Math.max(1, Math.min(action.quantity, maxStock))
        return { ...item, quantity: clamped }
      })
    }

    case 'remove': {
      return state.filter((item) => item.productId !== action.productId)
    }

    case 'clear': {
      return []
    }

    default:
      return state
  }
}
