// const goodsContent = document.getElementById('goods')
const url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2'
const GOODS_PER_PAGE = 15
let amountOfGoodsInCart = localStorage.getItem('goodsInCart') !== null ? localStorage.getItem('goodsInCart') : 0

const boundServeGoods = serveGoods.bind(this)

const btnSortPriceUP = document.getElementById('btn-sort-price-to-up')
const btnSortPriceDOWN = document.getElementById('btn-sort-price-to-down')
const btnShowAvailable = document.getElementById('btn-show-goods-available')
const btnResetFilters = document.getElementById('btn-reset-filters')

const orderNotification = document.querySelector('.order-alert')

let state = {
  SHOW_ONLY_AVAILABLE: false,
  goodsInCart: [],
  goodsToBuy: [],
  arrOfData: [],
}

const getData = () => fetch(url)
  .then((response) => response.json())
  .then((data) => {
    renderData(data, 0, GOODS_PER_PAGE)
    data.map((good) => state.arrOfData.push(good))
    initPagination(GOODS_PER_PAGE, state.arrOfData)
})

// function initPage() {
//   initState()
//   getData()
//   renderData()
//   initPagination()
// }
function initPageButtons(pagesQuantity) {
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
          renderData(state.arrOfData, sliceStart, sliceEnd)
        }
      })
    })
  }
}

function initPagination(goodsPerPage, data) {
  const pagesQuantity = Math.ceil(data.length / goodsPerPage)
  initPageButtons(pagesQuantity)
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
          <button class="good__buy-btn btn blue" id="goodItem${good.index}">Добавить в корзину</button> 
        </figure>  
      `
  )
}

function serveGoods() {
  const goods = document.querySelectorAll('.good')
  const cartIndicator = document.querySelector('.amount-in-cart')
  cartIndicator.innerHTML = amountOfGoodsInCart

  goods.forEach((good) => {
    good.addEventListener('click', function (e) {
      if (e.target.classList.contains('good__buy-btn')) {
        amountOfGoodsInCart++
        localStorage.setItem('goodsInCart', amountOfGoodsInCart)
        informAboutOrder(this.dataset.name)

        const currentItem = state.goodsInCart.find((item) => item.goodID == this.id)
        const currentObj = state.arrOfData.find((item) => item.index == this.id)

        if (!state.goodsToBuy.includes(currentObj)) {
          state.goodsToBuy.push(currentObj)
          localStorage.setItem(`order${currentObj.index}`, JSON.stringify(currentObj))
          console.log(localStorage)
        }

        console.log(this.price)

        if (currentItem) {
          currentItem.quantity++
        } else {
          state.goodsInCart.push({
            goodID: this.id,
            price: customParseFloat(this.dataset.price),
            quantity: 1,
          })
        }

        localStorage.setItem('goodsToBuy', JSON.stringify(state.goodsInCart))
        cartIndicator.innerHTML = localStorage.getItem('goodsInCart')
      }
    })
  })
}

function renderData(data, sliceStart, sliceEnd) {
  const goodsContent = document.getElementById('goods')

  goodsContent.innerHTML = ''
  goodsContent.innerHTML = data.slice(sliceStart, sliceEnd).map((good) => renderGood(good))
  boundServeGoods()
}

function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() function doesn't work
  const commaPos = float.indexOf(',')
  return `${float.slice(0, commaPos)}.${float.slice(commaPos + 1)}`
}

function sortPriceToUp(data) {
  const sortedData = data.sort((a, b) => customParseFloat(a.price.slice(1)) - customParseFloat(b.price.slice(1))).slice(0)

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, GOODS_PER_PAGE)
  }
  return renderData(sortedData, 0, GOODS_PER_PAGE)
}

function sortPriceToDown(data) {
  const sortedData = data.sort((a, b) => customParseFloat(b.price.slice(1)) - customParseFloat(a.price.slice(1)))

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, GOODS_PER_PAGE)
  }
  return renderData(sortedData, 0, GOODS_PER_PAGE)
}

function showAvailableGoods(data, sliceStart, sliceEnd) {
  const availableGoods = data.filter((good) => good.isInShop)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: true,
  }

  return renderData(availableGoods, sliceStart, sliceEnd)
}

function resetFilters() {
  const resetedArr = state.arrOfData.sort( (a, b) => a.index - b.index)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: false,
  }
  return renderData(resetedArr, 0, GOODS_PER_PAGE)
}

function informAboutOrder(name) {
  orderNotification.innerHTML = `Товар '${name}' добавлен в корзину`
  orderNotification.classList.add('--show')

  setTimeout(() => orderNotification.classList.remove('--show'), 1000)
}

btnSortPriceUP.addEventListener('click', () => sortPriceToUp(state.arrOfData) )
btnSortPriceDOWN.addEventListener('click', () => sortPriceToDown(state.arrOfData) )
btnShowAvailable.addEventListener('click', () => showAvailableGoods(state.arrOfData) )
btnResetFilters.addEventListener('click', () => resetFilters())

getData()

// initPage()
