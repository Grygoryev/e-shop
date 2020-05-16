import { state } from './state.js'
import { customParseFloat, informAboutOrder, countItemsInCart, countTotalSumm } from './serviceFunctions.js'

export function dispatchGoodOrder() {
  const goods = document.querySelectorAll('.good')
  const buyBtnClass = 'good__buy-btn'
  const removeBtnClass = 'good__remove-btn'

  goods.forEach( good => {
    updateGoodQuantity(good)
    good.addEventListener('click', function(e) {

      const currentOrderInfo = state.ordersInfo.find((item) => item.goodID == this.id)
      const currentGood = state.arrOfData.find((item) => item.index == this.id)

      const handleAddGood = () => {
        if (!state.goodsToOrder.includes(currentGood)) {
          state.goodsToOrder.push(currentGood)
          localStorage.setItem(`order${currentGood.index}`, JSON.stringify(currentGood))
        }
    
        if (currentOrderInfo) {
          currentOrderInfo.quantity++
        } else {
          state.ordersInfo.push({
            goodID: this.id,
            price: customParseFloat(this.dataset.price),
            quantity: 1,
          })
        }
        
        localStorage.setItem('ordersInfo', JSON.stringify(state.ordersInfo))
        informAboutOrder(this.dataset.name)
        countItemsInCart()
        updateGoodQuantity(good)
        countTotalSumm()
      }
      const handleRemoveGood = () => {
        if (state.goodsToOrder.includes(currentGood)) {
          state.goodsToOrder = state.goodsToOrder.filter(good => good != currentGood)
          localStorage.removeItem(`order${currentGood.index}`)
        }
    
        if (currentOrderInfo && currentOrderInfo.quantity > 1) {
          currentOrderInfo.quantity-- 
        } else if (currentOrderInfo) {
          state.ordersInfo = state.ordersInfo.filter(item => item.goodID != currentOrderInfo.goodID)
        }
    
        localStorage.setItem('ordersInfo', JSON.stringify(state.ordersInfo))
        countItemsInCart()
        updateGoodQuantity(good)
        countTotalSumm()
      }
   
      if (e.target.classList.contains(buyBtnClass)) { 
        handleAddGood()
      }

      if (e.target.classList.contains(removeBtnClass)) {
        handleRemoveGood()
      }
    })
  })

  function updateGoodQuantity(good) {
    const indicator = good.querySelector('.good__quantity-in-cart')
    let neededEl = state.ordersInfo.find(el => el.goodID == good.id)
    if (neededEl) {
      indicator.innerHTML = neededEl.quantity 
    } else {
      indicator.innerHTML = 0
    }
  }
}