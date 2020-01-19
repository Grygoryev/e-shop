const goodsContent = document.getElementById('goods')
const url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2'
const NOTES_PER_PAGE = 15
let amountOfGoodsInCart = localStorage.getItem('goodsInCart') !== null ? localStorage.getItem('goodsInCart') : 0

// let arrOfData = []
let boundServeGoods = serveGoods.bind(this)

let btnSortPriceUP = document.getElementById('btn-sort-price-to-up'),
    btnSortPriceDOWN = document.getElementById('btn-sort-price-to-down'),
    btnShowAvailable = document.getElementById('btn-show-goods-available'),
    btnResetFilters = document.getElementById('btn-reset-filters')

let orderNotification = document.querySelector('.order-alert')

let state = {
  SHOW_ONLY_AVAILABLE: false,
  goodsInCart: [],
  goodsToBuy: [],
  arrOfData: []
}

const getData = () => {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      renderData(data, 0, NOTES_PER_PAGE)
      data.map(good => state.arrOfData.push(good))
      paginate(NOTES_PER_PAGE, state.arrOfData)
    })
}

function pageButtons(pages) {
  let wrapper = document.getElementById('goods-pagination')
  wrapper.innerHTML = ''
  let pageNumber = 1

  for (pageNumber; pageNumber < pages; pageNumber++) {
    wrapper.innerHTML += `
      <button value=${pageNumber} class="page-btn">${pageNumber}</button>
    `
  }

  let buttons = document.querySelectorAll('.page-btn')

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      console.log('clicked button number: ' + this.value)
        let sliceStart = (this.value - 1) * NOTES_PER_PAGE,
            sliceEnd = this.value * NOTES_PER_PAGE + sliceStart

        if (state.SHOW_ONLY_AVAILABLE) {
          showAvailableGoods(state.arrOfData, sliceStart, sliceEnd)
        } else {
          renderData(state.arrOfData, sliceStart, sliceEnd)
        }
    })
  })
}

function paginate(goodsPerPage = NOTES_PER_PAGE, data) {

  let pages = Math.ceil(data.length / goodsPerPage)
  pageButtons(pages, data, renderData)
}

function renderGood(good) {
  return (
    `
        <figure class="good" id="${good.index}">
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
  let goods = document.querySelectorAll('.good')
  let cartIndicator = document.querySelector('.amount-in-cart')
  cartIndicator.innerHTML = amountOfGoodsInCart

  goods.forEach( function(good) {
    good.addEventListener('click', function(e) {
      if (e.target.classList.contains('good__buy-btn')) {
        amountOfGoodsInCart++ 
        localStorage.setItem('goodsInCart', amountOfGoodsInCart)
        informAboutOrder()
        
        let currentItem = state.goodsInCart.find(item => item.goodID == this.id) 
        let currentObj = state.arrOfData.find(item => item.index == this.id)
        
        if (!state.goodsToBuy.includes(currentObj) ) {
          state.goodsToBuy.push(currentObj)
        } 
        
        if  (currentItem) {
          currentItem.quantity++
        } else {
          state.goodsInCart.push({
            'goodID': this.id,
            'quantity': 1
          }) 
        }

        console.log(state)
        localStorage.setItem('goodsToBuy', JSON.stringify(state.goodsInCart))
        cartIndicator.innerHTML = localStorage.getItem('goodsInCart')
      }
    })
  })
}

function renderData(data, sliceStart, sliceEnd) {
  goodsContent.innerHTML = ''
  goodsContent.innerHTML = data.slice(sliceStart, sliceEnd).map(good => renderGood(good))
  boundServeGoods()
}

function customParseFloat(float) {
  // this code exist beacouse upcoming float has ',' instead of '.'
  // with ',' sort() function doesn't work
  let commaPos = float.indexOf(',')
  return float.slice(0, commaPos ) + '.' + float.slice(commaPos + 1)
}

function sortPriceToUp(data) {
  let sortedData = data.slice(0).sort( (a, b) => { 
    return customParseFloat(a.price.slice(1)) - customParseFloat(b.price.slice(1))
  }).slice(0) 

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, NOTES_PER_PAGE)
  } else {
    return renderData(sortedData, 0, NOTES_PER_PAGE)
  }
}

function sortPriceToDown(data) {
  let sortedData = data.slice(0).sort( (a, b) => { 
    return customParseFloat(b.price.slice(1)) - customParseFloat(a.price.slice(1))
  })

  if (state.SHOW_ONLY_AVAILABLE) {
    return showAvailableGoods(sortedData, 0, NOTES_PER_PAGE)
  } else {
    return renderData(sortedData, 0, NOTES_PER_PAGE)
  }
}

function showAvailableGoods(data, sliceStart, sliceEnd) {
  let availableGoods = data.filter(good => good.isInShop)
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: true
  }

  return renderData(availableGoods, sliceStart, sliceEnd)
}

function resetFilters() {
  state = {
    ...state,
    SHOW_ONLY_AVAILABLE: false
  }
  return renderData(state.arrOfData, 0, NOTES_PER_PAGE)
}

function informAboutOrder() {
  orderNotification.innerHTML = `Good was added to cart`
  orderNotification.classList.add('--show')

  setTimeout( () => orderNotification.classList.remove('--show'), 1000)
}

btnSortPriceUP.addEventListener('click', () => {
  sortPriceToUp(state.arrOfData)
})

btnSortPriceDOWN.addEventListener('click', () => {
  sortPriceToDown(state.arrOfData) 
})

btnShowAvailable.addEventListener('click', () => {
  showAvailableGoods(state.arrOfData)
})

btnResetFilters.addEventListener('click', () => resetFilters())

getData()
