export let state = {
  SHOW_ONLY_AVAILABLE: false,
  ordersInfo: localStorage.getItem('ordersInfo') ? JSON.parse(localStorage.getItem('ordersInfo')) : [],
  goodsToOrder: [],
  arrOfData: [],
  GOODS_PER_PAGE: 15
}