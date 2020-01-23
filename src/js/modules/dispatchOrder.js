import { state } from './state.js'
import { customParseFloat, informAboutOrder, countItemsInCart, countTotalSumm } from './serviceFunctions.js'

export function dispatchGoodOrder() {
  const goods = document.querySelectorAll('.good')
  const buyBtnClass = 'good__buy-btn'
  const removeBtnClass = 'good__remove-btn'

  goods.forEach( good => {
    updateGoodQuantity(good)
    good.addEventListener('click', function(e) {

      const currentItem = state.ordersInfo.find((item) => item.goodID == this.id)
      const currentObj = state.arrOfData.find((item) => item.index == this.id)

      const handleAddGood = () => {
        if (!state.goodsToOrder.includes(currentObj)) {
          state.goodsToOrder.push(currentObj)
          localStorage.setItem(`order${currentObj.index}`, JSON.stringify(currentObj))
        }
    
        if (currentItem) {
          currentItem.quantity++
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
        if (state.goodsToOrder.includes(currentObj)) {
          state.goodToOrder = state.goodsToOrder.filter(good => good != currentObj)
          localStorage.removeItem(`order${currentObj.index}`)
        }
    
        if (currentItem && currentItem.quantity > 1) {
          currentItem.quantity-- 
        } else if (currentItem) {
          state.ordersInfo = state.ordersInfo.filter(item => item.goodID != currentItem.goodID)
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