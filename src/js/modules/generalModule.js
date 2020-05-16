import { initData } from './initData.js'
import { state } from './state.js'
import { initPagination } from './initPagination.js'
import { initFilterPanel } from './initFilterPanel.js'
import { countItemsInCart } from './serviceFunctions.js'

export default function generalModule() {
  // const url = 'http://www.json-generator.com/api/json/get/bVwPCFYwky?indent=2' //  300 items
  const url = 'http://www.json-generator.com/api/json/get/cfWOfUvdaq?indent=2' // 900 items

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.map((good) => state.arrOfData.push(good))
      initData(data, 0, state.GOODS_PER_PAGE)
      initPagination(state.GOODS_PER_PAGE, state.arrOfData)
      initFilterPanel()
      countItemsInCart()
    })
}