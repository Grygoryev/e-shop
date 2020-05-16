import { renderGood } from './renderGood.js'
import { dispatchGoodOrder } from './dispatchOrder.js'

export function initData(data, sliceStart, sliceEnd) {
  const goodsContent = document.getElementById('goods')

  goodsContent.innerHTML = ''
  goodsContent.innerHTML = data.slice(sliceStart, sliceEnd).map((good) => renderGood(good))
  dispatchGoodOrder()
}