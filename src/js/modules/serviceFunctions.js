import { state } from './state.js'
import { initData } from './initData.js'
import { initPagination } from './initPagination.js'

export function countItemsInCart() {
  const cartIndicator = document.querySelector('.amount-in-cart')
  let itemsInCart = JSON.parse(localStorage.getItem('ordersInfo'))

  if ( itemsInCart )  {
   return cartIndicator.innerHTML = itemsInCart.reduce( (summ, item) => summ += item.quantity, 0)
  } else {
    return cartIndicator.innerHTML = 0
  }
}

export function informAboutOrder(name) {
  const orderNotification = document.querySelector('.order-alert')

  orderNotification.innerHTML = `Товар '${name}' добавлен в корзину`
  orderNotification.classList.add('--show')

  setTimeout(() => orderNotification.classList.remove('--show'), 1000)
}

export function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() export function doesn't work
  const commaPos = float.indexOf(',')
  return `${float.slice(0, commaPos)}.${float.slice(commaPos + 1)}`
}

export function countTotalSumm() {
  const totalPlaceholder = document.getElementById('cart-total')
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))
  
  if (ordersInfo) {
    let totalPrice = ordersInfo.reduce((sum, item) => sum += item.price.slice(1) * item.quantity, 0)
    totalPlaceholder.innerHTML = 'Общая сумма покупки: $' + totalPrice.toFixed(3)
    return
  } 
  totalPlaceholder.innerHTML = 'Общая сумма покупки: 0'
}

/* begin of FILTER export functions*/
export function sortPriceToUp(data) {
  const sortedData = data.sort((a, b) => customParseFloat(a.price.slice(1)) - customParseFloat(b.price.slice(1))).slice(0)

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, state.GOODS_PER_PAGE)
  }
  return initData(sortedData, 0, state.GOODS_PER_PAGE)
}

export function sortPriceToDown(data) {
  const sortedData = data.sort((a, b) => customParseFloat(b.price.slice(1)) - customParseFloat(a.price.slice(1)))

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, state.GOODS_PER_PAGE)
  }
  return initData(sortedData, 0, state.GOODS_PER_PAGE)
}

export function showAvailableGoods(data, sliceStart, sliceEnd) {
  const availableGoods = data.filter((good) => good.isInShop)
  let newState = {
    ...state,
    SHOW_ONLY_AVAILABLE: true,
  }

  Object.assign(state, newState)

  return initData(availableGoods, sliceStart, sliceEnd)
}

export function resetFilters() {
  initPagination(state.GOODS_PER_PAGE, state.arrOfData)
  const resetedArr = state.arrOfData.sort( (a, b) => a.index - b.index)
  let newState = {
    ...state,
    SHOW_ONLY_AVAILABLE: false,
  }

  Object.assign(state, newState)

  return initData(resetedArr, 0, state.GOODS_PER_PAGE)
}