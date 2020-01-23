import { state } from './state.js'
import { initData } from './initData.js'
import { showAvailableGoods } from './serviceFunctions.js'

export function initPagination(goodsPerPage, data) {
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
    
    const renderSwitchedPage = (pressedButton) => {
      const sliceStart = (pressedButton.value - 1) * state.GOODS_PER_PAGE
      const sliceEnd = pressedButton.value * state.GOODS_PER_PAGE 

      if (state.SHOW_ONLY_AVAILABLE) {
        showAvailableGoods(state.arrOfData, sliceStart, sliceEnd)
      } else {
        initData(state.arrOfData, sliceStart, sliceEnd)
      }
    }

    paginationBeginButton.value = 1;
    paginationEndButton.value = pagesQuantity;

    paginationBeginButton.addEventListener('click', function() {
      createPageButtons(pagesQuantity, 1, 5)
      handlePageSwitching(pagesQuantity)
      renderSwitchedPage(this)
    })

    paginationEndButton.addEventListener('click', function() {
      createPageButtons(pagesQuantity, pagesQuantity - 4, pagesQuantity)
      handlePageSwitching(pagesQuantity)
      renderSwitchedPage(this)
    })
   
    buttons.forEach((btn) => {
      btn.addEventListener('click', function () {
        /* Below is a calculation of which buttons to render and which to hide
        depending on pressed button */
        const step = 2
        let beginValue = (this.value - step) < 1 ? 1 : this.value - step
        let endValue = (+this.value + step > pagesQuantity ) ? pagesQuantity : beginValue + step * 2

        if (pagesQuantity - step * 2 < beginValue) {
          beginValue = pagesQuantity - step * 2
        }

        createPageButtons(pagesQuantity, beginValue, endValue)
        handlePageSwitching(pagesQuantity)
        renderSwitchedPage(this)
      })
    })
  }
}