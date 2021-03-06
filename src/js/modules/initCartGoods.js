import { state } from './state.js'
import { renderGood } from './renderGood.js'

export function initGoodsInCart() {
  const cart = document.getElementById('cart')
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))

  dispatchOrdersInfo()
  renderGoodsToOrder()

  
  function dispatchOrdersInfo() {
    ordersInfo.forEach( order => {
      let orderObj = localStorage.getItem(`order${order.goodID}`)
      state.goodsToOrder.push( JSON.parse(orderObj))
    })
  }

  function renderGoodsToOrder() {
    state.goodsToOrder.forEach(good => {
      cart.innerHTML += renderGood(good)
    })
  }
}