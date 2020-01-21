const url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2'
const GOODS_PER_PAGE = 15
// const boundServeGoods = serveGoods.bind(this)

let state = {
  SHOW_ONLY_AVAILABLE: false,
  cartInfo: localStorage.getItem('cartInfo') ? JSON.parse(localStorage.getItem('cartInfo')) : [],
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

function renderGood(good) {
  return (
    `
        <figure class="good" id="${good.index}" data-name="${good.type} ${good.index}" data-price="${good.price}">
          <figcaption class="good__title"> ${good.type} ${good.index} </figcaption>
          <img src='${good.picture}' class="good__img" />
          <p class="good__description">${good.about}</p>
          <p class="good__price"> <b>Цена: </b> ${good.price}</p>
          <p class="good__available"> ${good.isInShop ? '<b> В наличии </b>' : 'Товара нет в наличии'}</p>
          <button class="good__buy-btn btn blue" id="goodItem${good.index}">Добавить в корзину</button> 
        </figure>  
      `
  )
}

function initPage() {
  getData()
  initFilterPanel()
  countItemsInCart()
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

  createPageButtons(pagesQuantity)
  handlePageSwitching()
  
  function createPageButtons(pagesQuantity) {
    const wrapper = document.getElementById('goods-pagination')
    // wrapper.innerHTML = ''

    for (let pageNumber = 1; pageNumber < pagesQuantity; pageNumber++) {
      wrapper.innerHTML += `
        <button value=${pageNumber} class="page-btn">${pageNumber}</button>
      `
    }
  }
  function handlePageSwitching() {
    const buttons = document.querySelectorAll('.page-btn')

    buttons.forEach((btn) => {
      btn.addEventListener('click', function () {
  
        const sliceStart = (this.value - 1) * GOODS_PER_PAGE
        const sliceEnd = this.value * GOODS_PER_PAGE + sliceStart
  
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

  goods.forEach( (good) => {

    good.addEventListener('click', function(e) {

      if (e.target.classList.contains(buyBtnClass)) {
        const currentItem = state.cartInfo.find((item) => item.goodID == this.id)
        const currentObj = state.arrOfData.find((item) => item.index == this.id)

        if (!state.goodsToOrder.includes(currentObj)) {
          state.goodsToOrder.push(currentObj)
          localStorage.setItem(`order${currentObj.index}`, JSON.stringify(currentObj))
        }

        if (currentItem) {
          currentItem.quantity++
        } else {
          state.cartInfo.push({
            goodID: this.id,
            price: customParseFloat(this.dataset.price),
            quantity: 1,
          })
        }

        localStorage.setItem('cartInfo', JSON.stringify(state.cartInfo))
        informAboutOrder(this.dataset.name)
        countItemsInCart()
      }
    })
  })
}

function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() function doesn't work
  const commaPos = float.indexOf(',')
  return `${float.slice(0, commaPos)}.${float.slice(commaPos + 1)}`
}

function countItemsInCart() {
  const cartIndicator = document.querySelector('.amount-in-cart')
  let itemsInCart = JSON.parse(localStorage.getItem('cartInfo'))

  if ( itemsInCart )  {
   return cartIndicator.innerHTML = itemsInCart.reduce( (summ, item) => summ += item.quantity, 0)
  } else {
    return cartIndicator.innerHTML = 0
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
  const resetedArr = state.arrOfData.sort( (a, b) => a.index - b.index)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: false,
  }
  return initData(resetedArr, 0, GOODS_PER_PAGE)
}
/* end of FILTER functions*/

function informAboutOrder(name) {
  const orderNotification = document.querySelector('.order-alert')

  orderNotification.innerHTML = `Товар '${name}' добавлен в корзину`
  orderNotification.classList.add('--show')

  setTimeout(() => orderNotification.classList.remove('--show'), 1000)
}

initPage()
