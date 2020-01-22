const url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2'
const GOODS_PER_PAGE = 15

let state = {
  SHOW_ONLY_AVAILABLE: false,
  ordersInfo: localStorage.getItem('ordersInfo') ? JSON.parse(localStorage.getItem('ordersInfo')) : [],
  goodsToOrder: [],
  arrOfData: [],
}

const getData = () => fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.map((good) => state.arrOfData.push(good))
    initData(data, 0, GOODS_PER_PAGE)
    initPagination(GOODS_PER_PAGE, state.arrOfData)
})

/* MAIN FUNCTIONS */
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

function initPage() {
  getData()
  initFilterPanel()
  countItemsInCart()
  countTotalSumm()
}

function initFilterPanel() {
  const btnSortPriceUP = document.getElementById('btn-sort-price-to-up')
  const btnSortPriceDOWN = document.getElementById('btn-sort-price-to-down')
  const btnShowAvailable = document.getElementById('btn-show-goods-available')
  const btnResetFilters = document.getElementById('btn-reset-filters')

  btnSortPriceUP.addEventListener('click', () => sortPriceToUp(state.arrOfData) )
  btnSortPriceDOWN.addEventListener('click', () => sortPriceToDown(state.arrOfData) )
  btnShowAvailable.addEventListener('click', () => showAvailableGoods(state.arrOfData) )
  btnResetFilters.addEventListener('click', () => resetFilters())
}

function initPagination(goodsPerPage, data) {
  const pagesQuantity = Math.ceil(data.length / goodsPerPage)
  createPageButtons(pagesQuantity, 1, 5)
  handlePageSwitching(pagesQuantity)
  
  
  function createPageButtons(pagesQuantity, beginButtonNumber, endButtonNumber) {
    const wrapper = document.getElementById('goods-pagination')
    wrapper.innerHTML = ''
    let pageNumber = beginButtonNumber

    for (pageNumber; pageNumber <= endButtonNumber; pageNumber++) {
      wrapper.innerHTML += `
        <button value=${pageNumber} class="page-btn">${pageNumber}</button>
      `
    }
  }
  function handlePageSwitching(pagesQuantity) {
    const buttons = document.querySelectorAll('.page-btn')
    const paginationBeginButton = document.getElementById('goods-pagination-to-begin')
    const paginationEndButton = document.getElementById('goods-pagination-to-end')

    paginationBeginButton.value = 1;
    paginationEndButton.value = pagesQuantity;

    paginationBeginButton.addEventListener('click', function () {
      createPageButtons(pagesQuantity, 1, 5)
      handlePageSwitching(pagesQuantity)

      const sliceStart = (this.value - 1) * GOODS_PER_PAGE
      const sliceEnd = this.value * GOODS_PER_PAGE 

      if (state.SHOW_ONLY_AVAILABLE) {
        showAvailableGoods(state.arrOfData, sliceStart, sliceEnd)
      } else {
        initData(state.arrOfData, sliceStart, sliceEnd)
      }
    })

    paginationEndButton.addEventListener('click', function () {
      createPageButtons(pagesQuantity, pagesQuantity - 4, pagesQuantity)
      handlePageSwitching(pagesQuantity)

      const sliceStart = (this.value - 1) * GOODS_PER_PAGE
      const sliceEnd = this.value * GOODS_PER_PAGE 

      if (state.SHOW_ONLY_AVAILABLE) {
        showAvailableGoods(state.arrOfData, sliceStart, sliceEnd)
      } else {
        initData(state.arrOfData, sliceStart, sliceEnd)
      }
    })
   
    buttons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const step = 2
        let beginValue = (this.value - step) < 1 ? 1 : this.value - step
        let endValue = (+this.value + step > pagesQuantity ) ? pagesQuantity : beginValue + step * 2

        if (pagesQuantity - step * 2  < beginValue) {
          beginValue = pagesQuantity - step * 2
        }
        
        console.log(`
          begin value = ${beginValue}
          end value = ${endValue}
          this value = ${this.value}

          this value + step =  ${+this.value + step} 
        `)

        createPageButtons(pagesQuantity, beginValue, endValue)
        handlePageSwitching(pagesQuantity)

        const sliceStart = (this.value - 1) * GOODS_PER_PAGE
        const sliceEnd = this.value * GOODS_PER_PAGE 
  
        if (state.SHOW_ONLY_AVAILABLE) {
          showAvailableGoods(state.arrOfData, sliceStart, sliceEnd)
        } else {
          initData(state.arrOfData, sliceStart, sliceEnd)
        }
      })
    })
  }
}

function initData(data, sliceStart, sliceEnd) {
  const goodsContent = document.getElementById('goods')

  goodsContent.innerHTML = ''
  goodsContent.innerHTML = data.slice(sliceStart, sliceEnd).map((good) => renderGood(good))
  dispatchGoodOrder()
}

function dispatchGoodOrder() {
  const goods = document.querySelectorAll('.good')
  const buyBtnClass = 'good__buy-btn'
  const removeBtnClass = 'good__remove-btn'

  goods.forEach( good => {
    updateGoodQuantity(good)
    good.addEventListener('click', function(e) {

      const currentItem = state.ordersInfo.find((item) => item.goodID == this.id)
      const currentObj = state.arrOfData.find((item) => item.index == this.id)

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
        informAboutOrder(this.dataset.name)
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

/* SERVICE FUNCTIONS */
function countItemsInCart() {
  const cartIndicator = document.querySelector('.amount-in-cart')
  let itemsInCart = JSON.parse(localStorage.getItem('ordersInfo'))

  if ( itemsInCart )  {
   return cartIndicator.innerHTML = itemsInCart.reduce( (summ, item) => summ += item.quantity, 0)
  } else {
    return cartIndicator.innerHTML = 0
  }
}

function informAboutOrder(name) {
  const orderNotification = document.querySelector('.order-alert')

  orderNotification.innerHTML = `Товар '${name}' добавлен в корзину`
  orderNotification.classList.add('--show')

  setTimeout(() => orderNotification.classList.remove('--show'), 1000)
}

function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() function doesn't work
  const commaPos = float.indexOf(',')
  return `${float.slice(0, commaPos)}.${float.slice(commaPos + 1)}`
}

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

/* beginof FILTER functions*/
function sortPriceToUp(data) {
  const sortedData = data.sort((a, b) => customParseFloat(a.price.slice(1)) - customParseFloat(b.price.slice(1))).slice(0)

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, GOODS_PER_PAGE)
  }
  return initData(sortedData, 0, GOODS_PER_PAGE)
}

function sortPriceToDown(data) {
  const sortedData = data.sort((a, b) => customParseFloat(b.price.slice(1)) - customParseFloat(a.price.slice(1)))

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, GOODS_PER_PAGE)
  }
  return initData(sortedData, 0, GOODS_PER_PAGE)
}

function showAvailableGoods(data, sliceStart, sliceEnd) {
  
  const availableGoods = data.filter((good) => good.isInShop)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: true,
  }

  return initData(availableGoods, sliceStart, sliceEnd)
}

function resetFilters() {
  initPagination(GOODS_PER_PAGE, state.arrOfData)
  const resetedArr = state.arrOfData.sort( (a, b) => a.index - b.index)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: false,
  }
  return initData(resetedArr, 0, GOODS_PER_PAGE)
}
/* end of FILTER functions*/

initPage()
