function countTotalSumm() {
  const totalPlaceholder = document.getElementById('cart-total')
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))
  
  if (ordersInfo) {
    let totalPrice = ordersInfo.reduce((sum, item) => sum += item.price.slice(1) * item.quantity, 0)
    return totalPlaceholder.innerHTML = 'Общая сумма покупки: $' + totalPrice.toFixed(3)
  } else {
    return totalPlaceholder.innerHTML = 'Общая сумма покупки: 0' 
  }  
}

function initGoodsInCart() {
  const cart = document.getElementById('cart')

  let goodsToOrder = []
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))

  ordersInfo.forEach( item => {
    let orderObj = localStorage.getItem(`order${item.goodID}`)
    goodsToOrder.push( JSON.parse(orderObj))
  })
  
  goodsToOrder.forEach(good => {
    cart.innerHTML += renderGood(good)
  })
}

countTotalSumm()
initGoodsInCart()
