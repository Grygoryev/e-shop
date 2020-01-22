let state = {
  ordersInfo: localStorage.getItem('ordersInfo') ? JSON.parse(localStorage.getItem('ordersInfo')) : [],
  goodsToOrder: [],
  arrOfData: []
}

function countTotalSumm() {
  const totalPlaceholder = document.getElementById('cart-total')
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))
  
  if (ordersInfo) {
    let totalPrice = ordersInfo.reduce((sum, item) => sum += item.price.slice(1) * item.quantity, 0)
    return totalPlaceholder.innerHTML = 'Общая сумма покупки: ' + '<span>$' + totalPrice.toFixed(3) + '</span>'
  } else {
    return totalPlaceholder.innerHTML = 'Общая сумма покупки: 0' 
  }  
}

function initGoodsInCart() {
  const cart = document.getElementById('cart')

  // let goodsToOrder = []
  let ordersInfo = JSON.parse(localStorage.getItem('ordersInfo'))

  ordersInfo.forEach( item => {
    let orderObj = localStorage.getItem(`order${item.goodID}`)
    state.goodsToOrder.push( JSON.parse(orderObj))
  })

  console.log(state.goodsToOrder)
  
  state.goodsToOrder.forEach(good => {
    cart.innerHTML += renderGood(good)
  })
}

function renderGood(good) {
  return (
    `
        <figure class="good" id="${good.index}" data-name="${good.type} ${good.index}" data-price="${good.price}">
          <figcaption class="good__title"> ${good.type} ${good.index} </figcaption>
          <img src='${good.picture}' class="good__img" />
          <p class="good__description">${good.about}</p>
          <p class="good__price"> <b>Цена: </b> ${good.price}</p>
          <p class="good__available"> ${good.isInShop ? '<b> В наличии </b>' : 'Товара нет в наличии'}</p>
          <div class="good__buy-panel"> 
            <button class="good__buy-option good__remove-btn btn red" id="goodItem${good.index}">-</button>
            <div class="good__quantity-in-cart" >0</div>
            <button class="good__buy-option good__buy-btn btn green" id="goodItem${good.index}">+</button> 
          </div>
        </figure>  
      `
  )
}

function dispatchGoodOrder() {
  const goods = document.querySelectorAll('.good')
  const buyBtnClass = 'good__buy-btn'
  const removeBtnClass = 'good__remove-btn'

  goods.forEach( good => {
    updateGoodQuantity(good)
    good.addEventListener('click', function(e) {

      const currentItem = state.ordersInfo.find((item) => item.goodID == this.id)
      const currentObj = state.goodsToOrder.find((item) => item.index == this.id)

      if (e.target.classList.contains(buyBtnClass)) { 

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
        countItemsInCart()
        updateGoodQuantity(good)
        countTotalSumm()
        console.log(state.ordersInfo)
      }

      if (e.target.classList.contains(removeBtnClass)) {
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
    })
  })

  function updateGoodQuantity(good) {
    const indicator = good.querySelector('.good__quantity-in-cart')
    let neededEl = state.ordersInfo.find(el => el.goodID == good.id)
    if (neededEl) {
      return indicator.innerHTML = neededEl.quantity 
    } else {
      return indicator.innerHTML = 0
    }
  }
}

function countItemsInCart() {
  const cartIndicator = document.querySelector('.amount-in-cart')
  let itemsInCart = JSON.parse(localStorage.getItem('ordersInfo'))

  if ( itemsInCart )  {
   return cartIndicator.innerHTML = itemsInCart.reduce( (summ, item) => summ += item.quantity, 0)
  } else {
    return cartIndicator.innerHTML = 0
  }
}

function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() function doesn't work
  const commaPos = float.indexOf(',')
  return `${float.slice(0, commaPos)}.${float.slice(commaPos + 1)}`
}

countItemsInCart()
initGoodsInCart()
countTotalSumm()
dispatchGoodOrder()
