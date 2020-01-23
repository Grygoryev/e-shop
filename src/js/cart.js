import { countTotalSumm, countItemsInCart } from './modules/serviceFunctions.js'
import { dispatchGoodOrder } from './modules/dispatchOrder.js'
import { initGoodsInCart } from './modules/initCartGoods.js'

countItemsInCart()
initGoodsInCart()
countTotalSumm()
dispatchGoodOrder()
