// import getData from './modules/getData'

const goodsContent = document.getElementById('goods')
let url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2'
const NOTES_PER_PAGE = 15;

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

        renderData(arrOfData, sliceStart, sliceEnd)
    })
  })
}

function paginate(goodsPerPage = 15, data) {

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
          <button class="good__buy-btn btn blue">Добавить в корзину</button> 
        </figure>  
      `
  )
}

function renderData(data, sliceStart, sliceEnd) {
  goodsContent.innerHTML = ''
  goodsContent.innerHTML = data.slice(sliceStart, sliceEnd).map(good => renderGood(good))
}

let arrOfData = []

const getData = () => {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      renderData(data, 0, 15)
      data.map(good => arrOfData.push(good))
      paginate(NOTES_PER_PAGE, arrOfData)
    })
}

getData()

function customParseFloat(float) {
  let commaPos = float.indexOf(',')
  return float.slice(0, commaPos ) + '.' + float.slice(commaPos + 1)
}

function sortPriceToUp(data) {
  let sortedData = data.sort( (a, b) => { 
    return customParseFloat(a.price.slice(1)) - customParseFloat(b.price.slice(1))
  }) 

  return renderData(sortedData, 0, 15)
}

function sortPriceToDown(data) {
  let sortedData = data.sort( (a, b) => { 
    return customParseFloat(b.price.slice(1)) - customParseFloat(a.price.slice(1))
  }) 

  return renderData(sortedData, 0, 15)
}

let btnSortPriceUP = document.getElementById('btn-sort-price-to-up'),
    btnSortPriceDOWN = document.getElementById('btn-sort-price-to-down')

  btnSortPriceUP.addEventListener('click', () => sortPriceToUp(arrOfData) )
  btnSortPriceDOWN.addEventListener('click', () => sortPriceToDown(arrOfData) )

