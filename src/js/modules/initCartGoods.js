import { state } from './state.js'
import { renderGood } from './renderGood.js'

export function initGoodsInCart() {
  const cart = document.getElementById('cart')
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))

  ordersInfo.forEach( item => {
    let orderObj = localStorage.getItem(`order${item.goodID}`)
    state.goodsToOrder.push( JSON.parse(orderObj))
  })
  
  state.goodsToOrder.forEach(good => {
    cart.innerHTML += renderGood(good)
  })
}