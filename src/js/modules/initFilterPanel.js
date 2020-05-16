import { state } from './state.js'
import { showAvailableGoods, resetFilters, sortPriceToDown, sortPriceToUp } from './serviceFunctions.js'

export function initFilterPanel() {
  const btnSortPriceUP = document.getElementById('btn-sort-price-to-up')
  const btnSortPriceDOWN = document.getElementById('btn-sort-price-to-down')
  const btnShowAvailable = document.getElementById('btn-show-goods-available')
  const btnResetFilters = document.getElementById('btn-reset-filters')

  btnSortPriceUP.addEventListener('click', () => sortPriceToUp(state.arrOfData))
  btnSortPriceDOWN.addEventListener('click', () => sortPriceToDown(state.arrOfData))
  btnShowAvailable.addEventListener('click', () => showAvailableGoods(state.arrOfData))
  btnResetFilters.addEventListener('click', () => resetFilters())
}